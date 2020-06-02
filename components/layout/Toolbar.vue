<template>
  <div>
    <v-toolbar id="toolbar" class="primary" flat dense>
      <v-btn text @click="drawer = true">
        <v-icon :color="$vuetify.theme.dark ? '' : 'secondary'">
          menu
        </v-icon>
      </v-btn>
      <v-divider vertical class="mr-4" />
      <v-icon class="mr-2" :color="$vuetify.theme.dark ? '' : 'secondary'">
        {{ $vuetify.theme.dark ? 'wb_sunny' : 'brightness_2' }}
      </v-icon>
      <v-switch
        v-model="$vuetify.theme.dark"
        color="accent"
        class="mr-1"
        hide-details
      />
      <v-spacer />
      <Login v-if="!$auth.loggedIn" :first-access="firstAccess" />
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <UserMenu />
    </v-navigation-drawer>
  </div>
</template>

<script>
import Login from '@/components/Login'
import UserMenu from '@/components/UserMenu'

export default {
  components: {
    Login,
    UserMenu
  },
  data() {
    return {
      drawer: false,
      firstAccess: !this.$auth.loggedIn
    }
  },
  watch: {
    '$auth.loggedIn'(loggedIn) {
      if (loggedIn) {
        this.firstAccess = false
      } else {
        this.drawer = false
      }
    }
  }
}
</script>
<style lang="scss">
#toolbar {
  .v-toolbar__content {
    padding: 0 !important;
  }

  .v-btn {
    height: 100% !important;
    border-radius: 0;

    &--active {
      color &::before {
        background-color: transparent;
        opacity: 1;
      }
    }
  }
}
</style>
