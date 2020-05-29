<template>
  <div style="height: 100%">
    <div class="pa-8 text-center">
      <div v-if="!$auth.user.approved">
        <div class="subtitle-2 mb-2 primary--text">
          Palestra ao vivo:
        </div>
        <v-img :src="nextLecture.thumbnail" />
        <div class="primary--text subtitle-1 my-2">{{ nextLecture.title }}</div>
        <v-btn depressed small rounded color="primary" @click="goToLecture()">
          Assistir palestra
          <v-icon class="ml-1" small>
            open_in_new
          </v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-icon x-large color="warning">error_outline</v-icon><br />
        <div class="subtitle-1 warning--text mt-2">
          O pagamento da sua inscrição ainda não foi confirmado!
        </div>
      </div>
    </div>
    <v-divider />
    <v-list class="pt-0">
      <v-list-item
        v-for="item in menuItems"
        :key="item.name"
        class="px-8"
        :to="item.url"
        @click="item.click"
      >
        <v-list-item-icon class="mr-6">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nextLecture: {},
      menuItems: [
        { name: 'Cronograma', url: '/', icon: 'schedule', click: () => {} },
        {
          name: 'Mostra Científica',
          url: '/publications',
          icon: 'library_books',
          click: () => {}
        },
        { name: 'Alterar senha', icon: 'vpn_key', click: () => {} },
        { name: 'Sair', icon: 'exit_to_app', click: this.logout }
      ]
    }
  },
  created() {
    this.getNextLecture()
  },
  methods: {
    logout() {
      this.$auth.$storage.setUniversal('_token.local', null)
      this.$auth.setUser(null)
      this.$router.push('/')
    },
    async getNextLecture() {
      const lectures = await this.$axios.get('/lectures')

      this.nextLecture = this.$representers.lecture(lectures.data.data[0])
    },
    goToLecture() {
      window.open(this.nextLecture.link, '_blank')
    }
  }
}
</script>
