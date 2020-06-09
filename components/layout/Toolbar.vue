<template>
  <div>
    <v-toolbar id="toolbar" class="primary" flat dense>
      <v-btn
        v-show="$route.path != '/'"
        depressed
        text
        :color="$vuetify.theme.dark ? '' : 'secondary'"
        @mouseup="() => $router.go(-1)"
      >
        <v-icon>
          arrow_back
        </v-icon>
      </v-btn>
      <div v-if="desktop" id="navigation-menu">
        <v-btn
          v-for="item in navigationMenu"
          :key="item.name"
          large
          text
          exact
          active-class="accent"
          class="primary"
          :to="item.url"
        >
          <v-icon size="21" left>{{ item.icon }}</v-icon>
          {{ item.name }}
        </v-btn>
      </div>
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
        Participar<v-icon size="20" right>login</v-icon>
      </v-btn>
      <v-btn v-show="$auth.loggedIn && desktop" id="user-menu" text>
        <v-icon :color="$vuetify.theme.dark ? '' : 'secondary'">
          account_circle
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-menu
      v-if="desktop"
      open-on-hover
      open-delay="250"
      activator="#user-menu"
      :close-on-content-click="false"
    >
      <UserMenu :navigation-menu="navigationMenu" />
    </v-menu>
  </div>
</template>

<script>
import UserMenu from '@/components/UserMenu'

export default {
  components: {
    UserMenu
  },
  props: {
    navigationMenu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    desktop() {
      return this.$vuetify.breakpoint.lgAndUp
    }
  }
}
</script>
<style lang="scss">
#toolbar {
  .v-toolbar__content {
    padding: 0 !important;
  }

  #navigation-menu {
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
