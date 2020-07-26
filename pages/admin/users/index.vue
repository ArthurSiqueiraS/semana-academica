<template>
  <div style="height: 100%">
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
      <template v-slot:item.presence="{ item }">
        <span :class="(item.presence ? 'success' : 'error') + '--text'">
          {{ item.presence ? 'Sim' : 'Não' }}
        </span>
      </template>
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
        { text: 'Nome', value: 'name', align: 'center' },
        { text: 'CPF', value: 'cpf', align: 'center' },
        {
          text: 'E-mail',
          value: 'email',
          align: 'center'
        },
        {
          text: 'Presença confirmada',
          value: 'presence',
          align: 'center'
        }
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
    }
  }
}
</script>
