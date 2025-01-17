<template>
  <div style="height: 100%" class="publications-table">
    <v-data-table
      v-model="selectedPublications"
      :headers="headers"
      :items="publications"
      no-data-text="Nenhum dado encontrado."
      :disable-sort="mobile"
      show-select
      :items-per-page="5"
      :footer-props="footerProps"
      height="100%"
      style="height: 100%"
      class="primary--text d-flex flex-column"
      @click:row="(publication) => editPublication(publication)"
    >
      <template v-slot:top>
        <v-toolbar dense flat class="accent">
          <div class="title white--text">Posters</div>
          <v-spacer />

          <div v-if="mobile">
            <v-btn id="mobile-actions" text small color="white">
              Ações
              <v-icon>expand_more</v-icon>
            </v-btn>
            <v-menu activator="#mobile-actions">
              <v-list>
                <div v-for="action in actions" :key="action.name">
                  <v-list-item v-if="action.if">
                    <v-btn
                      class="d-flex justify-start transparent"
                      small
                      block
                      depressed
                      :color="action.color"
                      @click="action.click"
                    >
                      <v-icon left>{{ action.icon }}</v-icon>
                      {{ action.name }}
                    </v-btn>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
          </div>
          <div v-else class="d-flex flex-row-reverse">
            <div v-for="action in actions" :key="action.name">
              <v-btn
                v-if="action.if"
                small
                depressed
                class="ml-4"
                :color="action.color"
                @click="action.click"
              >
                {{ action.name }}
                <v-icon small right>{{ action.icon }}</v-icon>
              </v-btn>
            </div>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item.pdf="{ item }">
        <div
          class="d-flex align-center justify-center mr-n2"
          @click="blockRowClick = true"
        >
          <a
            :href="item.pdf"
            target="_blank"
            class="link py-3 pl-3 pr-2 ml-n3"
            :style="{ width: $vuetify.breakpoint.xsOnly && '250px' }"
          >
            {{ item.pdf }}
          </a>
        </div>
      </template>
      <template v-slot:item.link="{ item }">
        <div
          class="d-flex align-center justify-center mr-n2"
          @click="blockRowClick = true"
        >
          <n-link
            :to="item.link"
            class="link py-3 pl-3 pr-2 ml-n3"
            :style="{ width: $vuetify.breakpoint.xsOnly && '250px' }"
          >
            {{ $SITE_URL + item.link }}
          </n-link>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                large
                color="accent"
                v-on="on"
                @click="copyToClipboard($SITE_URL + item.link)"
              >
                <v-icon size="20">
                  content_copy
                </v-icon>
              </v-btn>
            </template>
            Copiar para área de transferência
          </v-tooltip>
        </div>
      </template>
      <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
        {{ pageStart }} - {{ pageStop }} de {{ itemsLength }}
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" width="400">
      <v-sheet class="pa-4">
        <v-card-title>
          Deseja excluir
          {{ selectionActive ? selectedPublications.length : 'todos os' }}
          posters?
        </v-card-title>

        <v-text-field
          v-if="!selectionActive"
          v-model="deleteAllConfirmation"
          class="px-8 pb-4"
          persistent-hint
          :hint="`Digite '${deleteAllPassword}' para continuar`"
          color="error"
        />

        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="accent"
            :disabled="deleting"
            @click="deleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn
            depressed
            color="error"
            :disabled="
              !selectionActive && deleteAllConfirmation != deleteAllPassword
            "
            :loading="deleting"
            @click="deletePublications"
            >Confirmar</v-btn
          >
        </v-card-actions>
      </v-sheet>
    </v-dialog>
  </div>
</template>
<script>
export default {
  middleware({ redirect, $auth }) {
    if (!$auth.hasScope()) {
      redirect('/')
    }
  },
  data() {
    return {
      selectedPublications: [],
      headers: [
        {
          text: 'Título',
          value: 'title',
          align: 'center'
        },
        { text: 'PDF', align: 'center', value: 'pdf', sortable: false },
        { text: 'Link', value: 'link', sortable: false, align: 'center' }
      ],
      footerProps: {
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos',
        showFirstLastPage: true
      },
      publications: [],
      deleteDialog: false,
      deleteAllConfirmation: '',
      deleteAllPassword: 'Posters',
      deleting: false,
      blockRowClick: false
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    selectionActive() {
      return this.selectedPublications.length > 0
    },
    actions() {
      return [
        {
          name: 'Adicionar poster',
          icon: 'add',
          color: 'primary--text',
          click: () => this.$router.push('/admin/publications/new'),
          if: true
        },
        {
          name: `Excluir ${
            this.selectionActive
              ? 'selecionadas (' + this.selectedPublications.length + ')'
              : 'todos'
          }`,
          icon: 'delete',
          color: 'error--text',
          click: () => (this.deleteDialog = true),
          if: this.publications.length > 0
        }
      ]
    }
  },
  watch: {
    deleteDialog(open) {
      if (!open) {
        this.deleteAllConfirmation = ''
      }
    }
  },
  created() {
    this.fetchPublications()
  },
  methods: {
    async fetchPublications() {
      const response = await this.$axios.get('/publications')

      this.publications = response.data.data.map(this.$representers.publication)
    },
    async copyToClipboard(content) {
      this.blockRowClick = true
      await navigator.clipboard.writeText(content)
      this.$notifications.push(
        'Link copiado para a área de transferência',
        'info'
      )
    },
    editPublication(publication) {
      if (!this.blockRowClick)
        this.$router.push(`/admin/publications/${publication.id}`)
      else this.blockRowClick = false
    },
    async deletePublications() {
      this.deleting = true

      const ids = this.selectedPublications.map((l) => l.id)
      await this.$axios.delete('/publications', {
        params: { ids }
      })
      if (this.selectionActive) {
        this.publications = this.publications.filter((l) => !ids.includes(l.id))
      } else {
        this.publications = []
      }
      this.deleting = false
      this.deleteDialog = false
      this.selectedPublications = []
    }
  }
}
</script>
<style lang="scss">
.publications-table {
  td {
    cursor: pointer !important;
  }
  .link {
    text-decoration: underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      opacity: 0.8;
      text-decoration: none;
    }
  }
}
</style>
