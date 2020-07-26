<template>
  <div style="height: 100%" class="lectures-table">
    <v-data-table
      v-model="selectedLectures"
      :headers="headers"
      :items="lectures"
      no-data-text="Nenhum dado encontrado."
      :disable-sort="mobile"
      show-select
      :items-per-page="5"
      :footer-props="footerProps"
      height="100%"
      style="height: 100%"
      :mobile-breakpoint="$vuetify.breakpoint.thresholds.sm"
      class="primary--text d-flex flex-column"
      @click:row="(lecture) => editLecture(lecture)"
    >
      <template v-slot:top>
        <v-toolbar dense flat class="accent">
          <div class="title white--text">Palestras</div>
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
      <template v-slot:header.data-table-select="{ props, on }">
        <div class="d-flex justify-center">
          <v-simple-checkbox
            color="primary"
            :value="props.value"
            @input="on.input"
            v-on="on"
          />
        </div>
      </template>
      <template v-slot:item.data-table-select="{ item, isSelected, select }">
        <div
          class="d-flex align-center flex-md-column-reverse mt-0 flex-grow-1"
        >
          <v-badge
            v-if="item.live"
            color="accent"
            content="Ao vivo"
            inline
            class="mt-md-2"
          />
          <v-spacer />
          <v-simple-checkbox
            color="primary"
            :value="isSelected"
            @input="select"
          />
        </div>
      </template>
      <template v-slot:item.thumbnail="{ item }">
        <v-dialog max-width="min-content">
          <template v-slot:activator="{ on }">
            <v-icon v-if="mobile" class="pa-2 mr-n2 mt-2" v-on="on"
              >photo</v-icon
            >
            <v-card
              v-else
              height="125"
              width="150"
              tile
              flat
              class="my-3"
              style="padding: 3px"
              color="primary"
              v-on="on"
            >
              <v-img :src="item.thumbnail" max-height="100%" max-width="100%" />
            </v-card>
          </template>
          <v-img
            :src="item.thumbnail"
            max-width="100%"
            max-height="80vh"
            class="elevation-4 rounded"
            contain
          />
        </v-dialog>
      </template>
      <template v-slot:item.link="{ item }">
        <div
          class="d-flex justify-end justify-md-start align-center mr-n2"
          @click="blockRowClick = true"
        >
          <n-link
            :to="item.link"
            class="link py-3 pl-3 pr-2 ml-n3"
            :style="{
              width:
                ($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.mdOnly) &&
                '250px'
            }"
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
          {{ selectionActive ? selectedLectures.length : 'todas as' }}
          palestras?
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
            @click="deleteLectures"
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
      selectedLectures: [],
      headers: [
        { text: 'Data', value: 'day' },
        { text: 'Horário', value: 'time' },
        { text: 'Título', value: 'title' },
        {
          text: 'Palestrante',
          value: 'speaker'
        },
        { text: 'Resumo', value: 'description' },
        { text: 'Capa', value: 'thumbnail', sortable: false },
        { text: 'Link', value: 'link', sortable: false }
      ],
      footerProps: {
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos',
        showFirstLastPage: true
      },
      lectures: [],
      deleteDialog: false,
      deleteAllConfirmation: '',
      deleteAllPassword: 'Palestras',
      deleting: false,
      blockRowClick: false
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    selectionActive() {
      return this.selectedLectures.length > 0
    },
    actions() {
      return [
        {
          name: 'Adicionar palestra',
          icon: 'add',
          color: 'primary--text',
          click: () => this.$router.push('/admin/lectures/new'),
          if: true
        },
        {
          name: `Excluir ${
            this.selectionActive
              ? 'selecionadas (' + this.selectedLectures.length + ')'
              : 'todas'
          }`,
          icon: 'delete',
          color: 'error--text',
          click: () => (this.deleteDialog = true),
          if: this.lectures.length > 0
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
    this.fetchLectures()
  },
  methods: {
    async fetchLectures() {
      const response = await this.$axios.get('/lectures')

      this.lectures = response.data.data.map(this.$representers.lecture)
    },
    async copyToClipboard(content) {
      this.blockRowClick = true
      await navigator.clipboard.writeText(content)
      this.$notifications.push(
        'Link copiado para a área de transferência',
        'info'
      )
    },
    editLecture(lecture) {
      if (!this.blockRowClick)
        this.$router.push(`/admin/lectures/${lecture.id}`)
      else this.blockRowClick = false
    },
    async deleteLectures() {
      this.deleting = true

      const ids = this.selectedLectures.map((l) => l.id)
      await this.$axios.delete('/lectures', {
        params: { ids }
      })
      if (this.selectionActive) {
        this.lectures = this.lectures.filter((l) => !ids.includes(l.id))
      } else {
        this.lectures = []
      }
      this.deleting = false
      this.deleteDialog = false
      this.selectedLectures = []
    }
  }
}
</script>
<style lang="scss">
.lectures-table {
  td {
    cursor: pointer !important;

    .v-data-table__mobile-row__cell {
      width: 100%;
    }
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
