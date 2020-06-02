<template>
  <div>
    <v-toolbar id="toolbar" class="primary" flat dense>
      <v-btn text @click="drawer = true">
        <v-icon :color="$vuetify.theme.dark ? '' : 'secondary'">
          menu
        </v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="
          !$auth.loggedIn && $route.path != '/login' && $route.path != '/signup'
        "
        text
        class="accent"
        :color="$vuetify.theme.dark ? '' : 'secondary'"
        to="/login"
      >
        <v-icon size="20" class="mr-1">login</v-icon>Participar
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <UserMenu />
    </v-navigation-drawer>
  </div>
</template>

<script>
import UserMenu from '@/components/UserMenu'

export default {
  components: {
    UserMenu
  },
  data() {
    return {
      drawer: false
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
