<template>
  <v-app>
    <Toolbar :navigation-menu="navigationMenu" />
    <v-main class="background">
      <nuxt />
    </v-main>
    <v-fab-transition v-if="$vuetify.breakpoint.lgAndUp">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="fab"
            v-scroll="onScroll"
            fab
            fixed
            bottom
            right
            color="accent"
            v-on="on"
            @click="toTop"
          >
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
        </template>
        Voltar ao topo
      </v-tooltip>
    </v-fab-transition>
    <div v-else>
      <v-btn
        large
        color="primary--text"
        fab
        fixed
        bottom
        right
        @click="userMenu = true"
      >
        <v-badge
          :value="eventOnline && !$auth.user.presence"
          offset-x="0"
          offset-y="0"
          left
          color="warning"
        >
          <v-icon>menu_open</v-icon>
        </v-badge>
      </v-btn>
      <v-navigation-drawer v-model="userMenu" right fixed temporary width="300">
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
    <v-snackbar
      v-show="pushNotification.text"
      multi-line
      top
      shaped
      :timeout="pushNotification.timeout"
      :value="pushNotification.text"
      :color="pushNotification.type || 'accent'"
    >
      <span class="font-weight-bold subtitle-1 white--text">{{
        pushNotification.text
      }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="$notifications.reset()">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
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
    eventOnline() {
      return this.$event.online()
    },
    pushNotification() {
      return this.$notifications.notification()
    },
    navigationMenu() {
      const navigationMenu = this.$wip
        ? []
        : [
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
    },
    eventOnline(online, previous) {
      if (this.$auth.loggedIn && previous != null) {
        this.$notifications.push(
          `O evento está ${online ? 'online' : 'offline'}.`,
          online ? 'success' : 'error'
        )
      }
    }
  },
  created() {
    this.$cable.subscribe({
      channel: 'SessionChannel',
      room: 'public'
    })
    this.fetchEventStatus()
  },
  channels: {
    SessionChannel: {
      received(data) {
        if (data === 'update_event') {
          this.fetchEventStatus()
        } else if (this.$auth.user && this.$auth.user.id === data.user.id) {
          this.$router.push('/')
          this.remoteConnection = true
        }
      }
    }
  },
  methods: {
    async fetchEventStatus() {
      const event = await this.$axios.get('/event')
      this.$event.set(event.data.online)
    },
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
