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
        <v-card class="px-6 pb-6 pt-4">
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="poster.title"
                prepend-icon="edit"
                hide-details
                clearable
                :rules="[(v) => !!v]"
                label="Título da palestra"
              />
            </v-col>
          </v-row>
        </v-card>
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
              :placeholder="poster.pdf"
              :rules="[
                (v) =>
                  !!v ||
                  (poster.pdf != '' && poster.pdf != null) ||
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
    const id = route.params.id
    let poster = {}

    if (id !== 'new') {
      try {
        const response = await $axios.get(`/publications/${route.params.id}`)
        poster = app.$representers.publication(response.data)
      } catch {
        redirect('/admin/publications')
      }
    }
    return { poster, id: id !== 'new' && id }
  },
  data() {
    return {
      valid: true,
      pdfFileValid: true,
      pdfFile: null,
      saving: false,
      deleteDialog: false,
      deleting: false
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

    pdfFileFormatError() {
      this.$notifications.push('Formato de arquivo inválido', 'error')
      this.invalidatePdfFileInput()
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
    invalidatePdfFileInput() {
      this.pdfFile = null
      this.pdfFileValid = false
    },
    validate() {
      this.pdfFileValid = this.$refs.pdfFileInput.validate()
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
      formData.set('title', this.poster.title)

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
