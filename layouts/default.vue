<template>
  <v-app>
    <Toolbar :navigation-menu="navigationMenu" />
    <v-content class="background">
      <nuxt />
    </v-content>
    <v-fab-transition v-if="$vuetify.breakpoint.lgAndUp">
      <v-btn
        v-show="fab"
        v-scroll="onScroll"
        fab
        fixed
        bottom
        right
        color="accent"
        @click="toTop"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>
    <div v-else>
      <v-btn large fab fixed bottom right @click="userMenu = true"
        ><v-icon>menu</v-icon></v-btn
      >
      <v-navigation-drawer v-model="userMenu" right fixed temporary>
        <UserMenu :navigation-menu="navigationMenu" />
      </v-navigation-drawer>
    </div>
    <Footer />
    <v-dialog
      v-model="remoteConnection"
      persistent
      width="max-content"
      max-width="100%"
    >
      <v-card shaped class="pa-2 text-center text-no-wrap">
        <v-card-title class="d-flex flex-column">
          <v-icon size="48" color="error" class="mb-2">priority_high</v-icon>
          Esta conta foi acessada <br />
          de outro local
        </v-card-title>
        <v-card-text>
          <v-spacer />
          Você será desconectado agora.
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            depressed
            rounded
            color="warning"
            @click="remoteConnection = false"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Footer from '@/components/layout/Footer'
import Toolbar from '@/components/layout/Toolbar'
import UserMenu from '@/components/UserMenu'

export default {
  components: {
    UserMenu,
    Footer,
    Toolbar
  },
  data() {
    return {
      fab: false,
      remoteConnection: false,
      userMenu: false
    }
  },
  computed: {
    navigationMenu() {
      const navigationMenu = [
        { name: 'Palestras', url: '/', icon: 'person_pin' },
        {
          name: 'Mostra Científica',
          url: '/publications',
          icon: 'library_books'
        }
      ]

      if (this.$auth.hasScope()) {
        navigationMenu.push({
          name: 'Administração',
          url: '/admin',
          icon: 'construction'
        })
      }

      return navigationMenu
    }
  },
  watch: {
    remoteConnection(open) {
      if (!open) {
        location.href = '/login'
      }
    }
  },
  mounted() {
    this.$cable.subscribe({
      channel: 'SessionChannel',
      room: 'public'
    })
  },
  channels: {
    SessionChannel: {
      received(data) {
        if (this.$auth.user && this.$auth.user.id === data.user.id) {
          this.$router.push('/')
          this.remoteConnection = true
        }
      }
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    }
  }
}
</script>
