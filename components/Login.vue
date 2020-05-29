<template>
  <v-dialog v-model="dialog" width="500" max-width="100%">
    <template v-slot:activator="{ on }">
      <div style="height: 100%" v-on="on">
        <slot name="activator">
          <v-btn
            text
            class="accent"
            :color="$vuetify.theme.dark ? '' : 'secondary'"
          >
            <v-icon size="20" class="mr-1">login</v-icon>ENTRAR
          </v-btn>
        </slot>
      </div>
    </template>
    <v-card shaped class="pa-4">
      <v-card-title class="d-flex flex-column pa-0">
        <v-row justify="end" style="width: 100%">
          <v-btn x-small icon outlined color="accent" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-row>
        <v-img
          v-show="!subscription"
          max-width="200px"
          :src="
            require($vuetify.theme.isDark
              ? '@/assets/images/SAM_logo_white.png'
              : '@/assets/images/SAM_logo_purple.png')
          "
        />
      </v-card-title>
      <div v-show="subscription == null">
        <div class="text-center px-6">
          Inscreva-se para participar das palestras de 27/07 a 31/07 e ter
          acesso à Mostra Científica do evento!
        </div>
        <div class="d-flex flex-column align-center py-6">
          <v-btn
            depressed
            color="primary"
            class="mb-2"
            @click="subscription = true"
            >Inscrever-se</v-btn
          >
          <v-btn text small color="accent" @click="subscription = false"
            >Já estou inscrito</v-btn
          >
        </div>
      </div>
      <v-form v-show="subscription == false">
        <div class="mx-12" @keyup.enter="login()">
          <v-text-field v-model="email" label="E-mail" />
          <v-text-field
            v-model="password"
            :type="hidePassword ? 'password' : ''"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            label="Senha"
            @click:append="hidePassword = !hidePassword"
          />
        </div>
        <v-card-actions>
          <v-btn
            text
            color="accent"
            :disabled="loading"
            @click="subscription = true"
          >
            Inscrever-se
          </v-btn>
          <v-spacer />
          <v-btn
            depressed
            rounded
            color="primary"
            :loading="loading"
            @click="login"
          >
            Entrar
          </v-btn>
        </v-card-actions>
      </v-form>
      <SubscriptionForm
        v-show="subscription"
        @cancelSubscription="subscription = false"
      />
    </v-card>
  </v-dialog>
</template>
<script>
import SubscriptionForm from '@/components/SubscriptionForm'

export default {
  components: {
    SubscriptionForm
  },
  props: {
    firstAccess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      password: '',
      hidePassword: true,
      subscription: null,
      dialog: this.firstAccess,
      loading: false
    }
  },
  watch: {
    dialog(open) {
      if (!open) {
        this.subscription = false
      }
    }
  },
  methods: {
    async login() {
      this.loading = true
      await this.$auth.loginWith('local', {
        data: {
          auth: {
            email: this.email,
            password: this.password
          }
        }
      })

      this.loading = false
    }
  }
}
</script>
