<template>
  <div>
    <v-toolbar
      v-show="$vuetify.breakpoint.lgAndUp"
      id="toolbar"
      class="primary"
      flat
      dense
    >
      <!-- removes spaces in small screens -->
      <v-btn
        v-for="link in links"
        :key="link.name"
        :to="link.url"
        text
        :color="$vuetify.theme.dark ? '' : 'secondary'"
      >
        <v-icon size="20" class="mr-1">{{ link.icon }}</v-icon>
        {{ link.name }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-icon class="mr-2" :color="$vuetify.theme.dark ? '' : 'secondary'">
        {{ $vuetify.theme.dark ? 'wb_sunny' : 'brightness_2' }}
      </v-icon>
      <v-switch
        v-model="$vuetify.theme.dark"
        class="mr-2"
        color="accent"
        hide-details
      />
      <Login :first-access="true" />
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute temporary right>
      <UserMenu slot="content" />
    </v-navigation-drawer>
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  components: {
    Login
  },
  data() {
    return {
      links: [
        { name: 'Cronograma', url: '/', icon: 'schedule' },
        {
          name: 'Mostra Científica',
          url: '/publications',
          icon: 'library_books'
        }
      ],
      drawer: false,
      firstAccess: true
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
