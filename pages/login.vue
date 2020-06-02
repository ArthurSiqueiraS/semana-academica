<template>
  <div
    class="d-flex flex-column align-center justify-center py-8"
    style="height: 100%"
  >
    <div>
      <v-img
        max-width="250px"
        contain
        :src="
          require($vuetify.theme.isDark
            ? '@/assets/images/SAM_logo_white.png'
            : '@/assets/images/SAM_logo_purple.png')
        "
      />
    </div>
    <v-form>
      <div style="width: 300px" @keyup.enter="login()">
        <v-text-field v-model="email" label="E-mail" />
        <v-text-field
          v-model="password"
          :type="hidePassword ? 'password' : ''"
          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
          label="Senha"
          @click:append="hidePassword = !hidePassword"
        />
      </div>
      <v-slide-y-transition>
        <div v-if="notFound" class="error--text text-center">
          E-mail ou senha incorretos
        </div>
      </v-slide-y-transition>
      <div class="d-flex flex-column mt-4 align-center">
        <v-btn
          class="px-12"
          depressed
          rounded
          color="primary"
          :loading="loading"
          @click="login"
        >
          Entrar
        </v-btn>
        <v-btn
          class="mt-4"
          text
          small
          color="accent"
          :disabled="loading"
          to="/signup"
        >
          Inscrever-se
        </v-btn>
      </div>
    </v-form>
  </div>
</template>
<script>
export default {
  auth: 'guest',
  data() {
    return {
      email: '',
      password: '',
      hidePassword: true,
      loading: false,
      notFound: false
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.notFound = false

      try {
        await this.$auth.loginWith('local', {
          data: {
            auth: {
              email: this.email,
              password: this.password
            }
          }
        })
      } catch (err) {
        if (err.response.status === 404) {
          this.notFound = true
        }
      }

      this.loading = false
    }
  }
}
</script>
