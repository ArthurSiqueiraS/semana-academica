<template>
  <div
    style="height: 100%"
    :class="$vuetify.theme.dark ? 'accent' : 'secondary'"
  >
    <div v-if="$auth.loggedIn">
      <div class="px-8 pt-4">
        <div class="title">{{ $auth.user.name }}</div>
        <div v-if="!$auth.hasScope()">
          Inscrição:
          <span v-if="$auth.user.approved" class="success--text">Aprovada</span>
          <span v-if="$auth.user.approved == null" class="warning--text"
            >Pendente</span
          >
          <span v-if="$auth.user.approved == false" class="error--text"
            >Rejeitada</span
          >
        </div>
        <div class="d-flex flex-column align-start pt-2">
          <div v-for="item in userMenu" :key="item.name">
            <v-btn text @click="item.click">
              {{ item.name }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-center ml-4">
      <v-icon
        class="mr-2"
        :color="$vuetify.theme.dark ? '' : 'info'"
        style="transform: rotateY(180deg)"
      >
        {{ $vuetify.theme.dark ? 'wb_sunny' : 'brightness_2' }}
      </v-icon>
      <v-switch v-model="$vuetify.theme.dark" color="primary" class="mr-1" />
    </div>
    <div v-if="$vuetify.breakpoint.mdAndDown">
      <v-divider />
      <v-list tile class="pt-0">
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
  </div>
</template>
<script>
export default {
  props: {
    navigationMenu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    userMenu() {
      const userMenu = [{ name: 'Sair', click: this.logout }]

      return userMenu
    }
  },
  methods: {
    logout() {
      this.$auth.$storage.setUniversal('_token.local', null)
      location.href = '/login'
    }
  }
}
</script>
