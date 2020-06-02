<template>
  <v-dialog width="500" :value="dialog">
    <v-card shaped class="pa-4">
      <v-card-title class="d-flex flex-column pa-0">
        <v-row justify="end" style="width: 100%">
          <v-btn x-small icon outlined color="accent" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-row>
        <v-img
          max-width="200px"
          :src="
            require($vuetify.theme.isDark
              ? '@/assets/images/SAM_logo_white.png'
              : '@/assets/images/SAM_logo_purple.png')
          "
        />
      </v-card-title>
      <div class="subtitle-1 text-center px-6 mt-1">
        Inscreva-se para participar das palestras de 27/07 a 31/07 e ter acesso
        à Mostra Científica do evento!
      </div>
      <div class="d-flex flex-column align-center py-6">
        <v-btn depressed color="primary" class="mb-2" to="/signup">
          Inscrever-se
        </v-btn>
        <div class="subtitle-2 mt-2">
          Já está inscrito?
          <n-link to="/login">
            <span class="accent--text">Clique aqui para entrar</span>
          </n-link>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    firstAccess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: this.firstAccess
    }
  },
  watch: {
    firstAccess(first) {
      if (first) {
        this.dialog = true
      }
    }
  }
}
</script>
