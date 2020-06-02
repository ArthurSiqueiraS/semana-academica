<template>
  <div style="height: 100%">
    <div v-if="$auth.loggedIn" class="">
      <!-- <div v-if="!$auth.user.approved">
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
      </div> -->
      <!-- <div>
        <v-icon x-large color="warning">error_outline</v-icon><br />
        <div class="subtitle-1 warning--text mt-2">
          O pagamento da sua inscrição ainda não foi confirmado!
        </div>
      </div> -->
      <div class="px-8 pt-4">
        <div class="title">John Doe</div>
        Inscrição:
        <span v-if="$auth.user.approved" class="success--text">Aprovada</span>
        <span v-if="$auth.user.approved == null" class="warning--text"
          >Pendente</span
        >
        <span v-if="$auth.user.approved == false" class="error--text"
          >Rejeitada</span
        >
        <div class="d-flex flex-column align-start pt-2 pb-4">
          <v-btn
            v-for="item in userMenu"
            :key="item.name"
            text
            :ripple="false"
            @click="item.click"
          >
            {{ item.name }}
          </v-btn>
        </div>
      </div>
      <v-divider />
    </div>
    <v-list class="pt-0">
      <v-subheader>
        Navegação
      </v-subheader>
      <v-list-item
        v-for="item in navigationMenu"
        :key="item.name"
        class="px-8"
        :to="item.url"
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
      userMenu: [{ name: 'Sair', icon: 'exit_to_app', click: this.logout }],
      navigationMenu: [
        { name: 'Cronograma', url: '/', icon: 'schedule', click: () => {} },
        {
          name: 'Mostra Científica',
          url: '/publications',
          icon: 'library_books',
          click: () => {}
        }
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
<style lang="scss" scoped>
.v-btn::before {
  background-color: transparent;
}
</style>
