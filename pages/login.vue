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
      <div style="width: 300px" @keyup.enter="signIn()">
        <v-text-field v-model="login" label="E-mail" />
        <v-text-field
          v-model="password"
          v-mask="$validations.masks.cpf"
          label="CPF"
        />
        <!-- <v-text-field
          v-model="password"
          :type="hidePassword ? 'password' : ''"
          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
          label="Senha"
          @click:append="hidePassword = !hidePassword"
        /> -->
      </div>
      <v-slide-y-transition>
        <div v-if="notFound" class="error--text text-center">
          Credenciais incorretas, tente novamente.
        </div>
      </v-slide-y-transition>
      <div class="d-flex flex-column mt-4 align-center">
        <v-btn
          class="px-12"
          depressed
          rounded
          color="primary"
          :loading="loading"
          @click="signIn"
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
    <v-slide-y-transition>
      <v-alert
        v-if="notFound"
        color="primary"
        outlined
        dense
        rounded
        class="warning--text text-center mt-8 mx-4"
      >
        Problemas para acessar?<br />Entre em contato pelo Whatsapp (53)
        98108-7033
      </v-alert>
    </v-slide-y-transition>
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
  auth: 'guest',
  data() {
    return {
      login: '',
      password: '',
      hidePassword: true,
      loading: false,
      notFound: false
    }
  },
  methods: {
    async signIn() {
      this.loading = true
      this.notFound = false

      try {
        await this.$auth.loginWith('local', {
          data: {
            auth: {
              login: this.login,
              password: this.password.replace(/\D/g, '')
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
