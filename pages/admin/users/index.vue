<template>
  <div style="height: 100%">
    <v-snackbar top color="success" :value="loading == false" :timeout="2000">
      Status de inscrição atualizado
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="users"
      no-data-text="Nenhum dado encontrado."
      :disable-sort="mobile"
      :items-per-page="10"
      :footer-props="footerProps"
      height="100%"
      style="height: 100%"
      class="users-table primary--text d-flex flex-column"
    >
      <template v-slot:top>
        <v-toolbar dense flat class="accent">
          <div class="title white--text">Inscrições</div>
        </v-toolbar>
      </template>
      <!-- <template v-slot:item.approved="{ item }">
        <v-radio-group
          v-model="item.approved"
          :disabled="loading"
          color="red"
          hide-details
          dense
          class="my-2"
          @change="(status) => updateUserStatus(item, status)"
        >
          <v-radio :value="true" color="success">
            <template v-slot:label>
              <div
                :class="
                  `${
                    item.approved ? 'success' : 'primary'
                  }--text subtitle-2 font-weight-regular`
                "
              >
                Aprovado
              </div>
            </template>
          </v-radio>
          <v-radio :value="false" color="error">
            <template v-slot:label>
              <div
                :class="
                  `${
                    item.approved == false ? 'error' : 'primary'
                  }--text subtitle-2 font-weight-regular`
                "
              >
                Rejeitado
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template> -->
      <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
        {{ pageStart }} - {{ pageStop }} de {{ itemsLength }}
      </template>
    </v-data-table>
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
      headers: [
        // { text: 'Matrícula', value: 'studentId', align: 'center' },
        { text: 'Nome', value: 'name', align: 'center' },
        { text: 'CPF', value: 'cpf', align: 'center' },
        {
          text: 'E-mail',
          value: 'email',
          align: 'center'
        }
        // {
        //   text: 'Status',
        //   value: 'approved',
        //   sortable: false,
        //   align: 'center'
        // }
      ],
      footerProps: {
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos',
        itemsPerPageOptions: [5, 10, 15, 20, 30, -1],
        showFirstLastPage: true
      },
      users: [],
      loading: null
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      const response = await this.$axios.get('/users', {
        params: { admin: false, format: 'maintenance' }
      })

      this.users = response.data.data
    },
    async updateUserStatus(user, status) {
      this.loading = true

      await this.$axios.put(`/users/${user.id}`, { approved: status })

      this.loading = false
    }
  }
}
</script>
