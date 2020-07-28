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
              Deseja excluir o poster?
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
        <Dropzone :drop-handler="addDropPdfFile">
          <v-col cols="12">
            <v-file-input
              ref="pdfFileInput"
              v-model="pdfFile"
              :hint="
                $vuetify.breakpoint.lgAndUp
                  ? 'Clique para buscar nos seus arquivos ou arraste um PDF até aqui'
                  : ''
              "
              :hide-details="$vuetify.breakpoint.mdAndDown"
              persistent-hint
              label="Adicionar arquivo PDF"
              accept="application/pdf"
              prepend-icon="note_add"
              :rules="[
                (v) =>
                  !!v ||
                  pdf != '' ||
                  'Clique para buscar nos seus arquivos ou arraste um PDF até aqui'
              ]"
              @blur="
                pdfFileValid =
                  $refs.pdfFileInput && $refs.pdfFileInput.validate()
              "
              @change="validatePdfFile"
            >
              <template v-slot:selection="{ text }">
                <v-chip small label color="primary">
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
          </v-col>
        </Dropzone>
        <Dropzone :drop-handler="addDropCoverFile">
          <v-col cols="12" md="8">
            <v-file-input
              id="cover-file-input"
              ref="coverFileInput"
              v-model="coverFile"
              :hint="
                $vuetify.breakpoint.lgAndUp
                  ? 'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
                  : ''
              "
              :hide-details="$vuetify.breakpoint.mdAndDown"
              persistent-hint
              label="Adicionar imagem de capa"
              accept="image/*"
              prepend-icon="add_a_photo"
              :rules="[
                (v) =>
                  !!v ||
                  cover != '' ||
                  'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
              ]"
              @blur="
                coverFileValid =
                  $refs.coverFileInput && $refs.coverFileInput.validate()
              "
              @change="validateCoverFile"
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
              :style="invalidStyle(coverFileValid)"
              @click="openCoverFileInput"
            >
              <v-img
                v-if="posterUrl || cover"
                max-height="100%"
                max-width="100%"
                :src="posterUrl || cover"
              >
              </v-img>
              <v-icon v-else :color="coverFileValid ? '' : 'error'" x-large
                >photo</v-icon
              >
            </v-card>
          </v-col>
        </Dropzone>
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
  </div>
</template>
<script>
import Dropzone from '@/components/Dropzone'

export default {
  components: {
    Dropzone
  },
  async asyncData({ redirect, $axios, route, app }) {
    let pdf = ''
    let cover = ''

    const id = route.params.id
    if (id !== 'new') {
      try {
        const response = await $axios.get(`/publications/${route.params.id}`)
        const poster = app.$representers.publication(response.data)
        pdf = poster.pdf
        cover = poster.cover
      } catch {
        redirect('/admin/publications')
      }
    }
    return { pdf, cover, id: id !== 'new' && id }
  },
  data() {
    return {
      valid: true,
      pdfFileValid: true,
      coverFileValid: true,
      pdfFile: null,
      coverFile: null,
      saving: false,
      deleteDialog: false,
      deleting: false
    }
  },
  computed: {
    posterUrl() {
      if (this.coverFile) {
        return URL.createObjectURL(this.coverFile)
      }

      return ''
    }
  },
  methods: {
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
    openCoverFileInput() {
      document.getElementById('cover-file-input').click()
    },
    addDropPdfFile(e) {
      this.$refs.pdfFileInput.focus()
      this.$refs.pdfFileInput.blur()

      const files = Object.values(e.dataTransfer.files).filter(
        (file) => file.type === 'application/pdf'
      )
      if (files[0]) {
        this.validatePdfFile(files[0])
      } else {
        this.pdfFileFormatError()
      }
    },
    addDropCoverFile(e) {
      this.$refs.coverFileInput.focus()
      this.$refs.coverFileInput.blur()

      const files = Object.values(e.dataTransfer.files).filter((file) =>
        file.type.split('/').includes('image')
      )
      if (files[0]) {
        this.validateCoverFile(files[0])
      } else {
        this.coverFileFormatError()
      }
    },
    pdfFileFormatError() {
      this.$notifications.push('Formato de arquivo inválido', 'error')
      this.invalidatePdfFileInput()
    },
    coverFileFormatError() {
      this.$notifications.push('Formato de arquivo inválido', 'error')
      this.invalidateCoverFileInput()
    },
    validatePdfFile(file) {
      if (file) {
        if (file.type === 'application/pdf') {
          this.pdfFileValid = true
          this.pdfFile = file
        } else {
          this.pdfFileFormatError()
        }
      } else {
        this.pdfFileValid = this.$refs.pdfFileInput.validate()
      }
    },
    validateCoverFile(file) {
      if (file) {
        if (file.type.split('/').includes('image')) {
          const vm = this
          const img = new Image()
          img.src = URL.createObjectURL(file)
          img.onload = function() {
            vm.coverFileValid = true
            vm.coverFile = file
          }
        } else {
          this.coverFileFormatError()
        }
      } else {
        this.coverFileValid = this.$refs.coverFileInput.validate()
      }
    },
    invalidatePdfFileInput() {
      this.pdfFile = null
      this.pdfFileValid = false
    },
    invalidateCoverFileInput() {
      this.coverFile = null
      this.coverFileValid = false
    },
    validate() {
      this.pdfFileValid = this.$refs.pdfFileInput.validate()
      this.coverFileValid = this.$refs.coverFileInput.validate()
      this.valid = this.$refs.form.validate()

      if (this.valid) {
        this.createPublication()
      }
    },
    async createPublication() {
      this.saving = true
      const formData = new FormData()

      if (this.pdfFile) {
        formData.set('pdfFile', this.pdfFile)
      }
      if (this.coverFile) {
        formData.set('coverFile', this.coverFile)
      }
      try {
        if (!this.id) {
          await this.$axios.post('/publications', formData)
        } else {
          await this.$axios.put(`/publications/${this.id}`, formData)
        }
      } catch (err) {
        this.$notifications.push(
          `Ocorreu um erro ao salvar o poster (Código ${err.response.status})`,
          'error'
        )
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
