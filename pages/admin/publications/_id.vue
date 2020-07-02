<template>
  <div
    class="d-flex justify-center align-center py-8"
    style="width: 100%; height: 100%"
  >
    <v-col cols="10" md="8" lg="6" xl="5">
      <v-form ref="form" :value="valid" lazy-validation>
        <h2 class="text-uppercase primary--text mb-8 text-center">
          {{ id ? 'Editar' : 'Adicionar' }} Poster
        </h2>
        <v-row v-if="id" no-gutters class="mb-2">
          <v-spacer />
          <v-btn
            small
            color="error"
            text
            :disabled="saving"
            @click="deleteDialog = true"
          >
            <v-icon small left>delete</v-icon>
            Excluir
          </v-btn>
        </v-row>
        <v-dialog v-model="deleteDialog" width="400" :persistent="deleting">
          <v-sheet class="pa-4">
            <v-card-title>
              Deseja excluir a poster?
            </v-card-title>

            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                color="accent"
                :disabled="deleting"
                @click="deleteDialog = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                depressed
                color="error"
                :loading="deleting"
                @click="deletePublication"
              >
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-sheet>
        </v-dialog>
        <v-card
          class="mt-8 pa-6"
          @dragenter="dropzoneEnter"
          @dragleave="dropzoneLeave"
          @drop.prevent="addDropFile"
          @dragover.prevent
        >
          <v-overlay color="primary" opacity="1" absolute :value="draggingOver">
            Solte para adicionar o arquivo
          </v-overlay>
          <v-row v-cloak no-gutters align="center">
            <v-snackbar
              v-model="fileFormatError"
              color="error"
              style="cursor: pointer"
              @click="fileFormatError = false"
            >
              Formato de arquivo inválido
            </v-snackbar>
            <v-col cols="12" md="8">
              <v-file-input
                id="file-input"
                ref="fileInput"
                v-model="posterFile"
                :hint="
                  $vuetify.breakpoint.lgAndUp
                    ? 'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
                    : ''
                "
                :hide-details="$vuetify.breakpoint.mdAndDown"
                persistent-hint
                label="Adicionar imagem"
                accept="image/*"
                prepend-icon="add_a_photo"
                :rules="[
                  (v) =>
                    !!v ||
                    poster != '' ||
                    'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
                ]"
                @blur="
                  fileValid = $refs.fileInput && $refs.fileInput.validate()
                "
                @change="validateFile"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-col>
            <v-col cols="12" md="4" class="mt-4 pl-md-4 d-flex justify-center">
              <v-card
                outlined
                width="150"
                height="125"
                class="d-flex align-center justify-center"
                :style="invalidStyle(fileValid)"
                @click="openFileInput"
              >
                <v-img
                  v-if="posterUrl || poster"
                  max-height="100%"
                  max-width="100%"
                  :src="posterUrl || poster"
                >
                </v-img>
                <v-icon v-else x-large>photo</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <div class="text-center">
          <v-btn
            color="primary"
            class="mt-8 px-8"
            :loading="saving"
            :disabled="deleting"
            @click="validate"
          >
            Salvar
          </v-btn>
          <v-slide-y-transition>
            <div v-if="!valid" class="mt-4 error--text">
              Preencha todos os campos
            </div>
          </v-slide-y-transition>
        </div>
      </v-form>
    </v-col>
    <v-snackbar v-model="error" color="error">
      Ocorreu um erro ao salvar o poster (Código {{ error }})
    </v-snackbar>
  </div>
</template>
<script>
export default {
  async asyncData({ redirect, $axios, route, app }) {
    let poster = ''

    const id = route.params.id
    if (id !== 'new') {
      try {
        const response = await $axios.get(`/publications/${route.params.id}`)
        poster = app.$representers.publication(response.data).poster
      } catch {
        redirect('/admin/publications')
      }
    }
    return { poster, id: id !== 'new' && id }
  },
  data() {
    return {
      valid: true,
      fileValid: true,
      posterFile: null,
      draggingOver: 0,
      fileFormatError: false,
      saving: false,
      deleteDialog: false,
      deleting: false,
      error: null
    }
  },
  computed: {
    posterUrl() {
      if (this.posterFile) {
        return URL.createObjectURL(this.posterFile)
      }

      return ''
    }
  },
  watch: {
    fileFormatError(error) {
      this.invalidateFileInput(error)
    }
  },
  methods: {
    dropzoneEnter(e) {
      e.preventDefault()

      this.draggingOver++
    },
    dropzoneLeave() {
      this.draggingOver--
    },
    invalidStyle(cond) {
      const errorColor = this.$vuetify.theme.currentTheme.error

      if (!cond) {
        return {
          border: '1px solid ' + errorColor,
          color: errorColor
        }
      }

      return {}
    },
    openFileInput() {
      document.getElementById('file-input').click()
    },
    addDropFile(e) {
      this.$refs.fileInput.focus()
      this.$refs.fileInput.blur()
      this.resetSnackbar()

      const files = Object.values(e.dataTransfer.files).filter((file) =>
        file.type.split('/').includes('image')
      )
      if (files[0]) {
        this.validateFile(files[0])
      } else {
        this.fileFormatError = true
      }
      this.draggingOver = 0
    },
    validateFile(file) {
      this.resetSnackbar()

      if (file) {
        if (file.type.split('/').includes('image')) {
          const vm = this
          const img = new Image()
          img.src = URL.createObjectURL(file)
          img.onload = function() {
            vm.fileValid = true
            vm.posterFile = file
          }
        } else {
          this.fileFormatError = true
        }
      } else {
        this.fileValid = this.$refs.fileInput.validate()
      }
    },
    resetSnackbar() {
      this.fileFormatError = false
    },
    invalidateFileInput(error) {
      if (error) {
        this.posterFile = null
        this.fileValid = false
      }
    },
    validate() {
      this.fileValid = this.$refs.fileInput.validate()
      this.valid = this.$refs.form.validate()

      if (this.valid) {
        this.createPublication()
      }
    },
    async createPublication() {
      this.saving = true
      const formData = new FormData()

      if (this.posterFile) {
        formData.set('file', this.posterFile)
      }
      try {
        if (!this.id) {
          await this.$axios.post('/publications', formData)
        } else {
          await this.$axios.put(`/publications/${this.id}`, formData)
        }
      } catch (err) {
        this.error = err.response.status
      }

      this.saving = false
      this.$router.go(-1)
    },
    async deletePublication() {
      this.deleting = true
      await this.$axios.delete('/publications', { params: { ids: [this.id] } })

      this.deleting = false
      this.$router.go(-1)
    }
  }
}
</script>
