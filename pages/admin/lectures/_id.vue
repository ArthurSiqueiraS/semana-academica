<template>
  <div class="d-flex justify-center py-8" style="width: 100%">
    <v-col cols="10" md="8" lg="6" xl="5">
      <v-form ref="form" :value="valid" lazy-validation>
        <h2 class="text-uppercase primary--text mb-8 text-center">
          {{ id ? 'Editar' : 'Adicionar' }} Palestra
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
              Deseja excluir a palestra?
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
                @click="deleteLecture"
              >
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-sheet>
        </v-dialog>
        <v-card class="px-6 pb-6 pt-4">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pr-md-4 mt-0">
              <v-text-field
                v-model="lecture.title"
                hide-details
                clearable
                :rules="[(v) => !!v]"
                label="Título da palestra"
              />
            </v-col>
            <v-col cols="12" md="6" class="pl-md-4 mt-8 mt-md-0">
              <v-text-field
                v-model="lecture.speaker"
                hide-details
                clearable
                :rules="[(v) => !!v]"
                label="Palestrante"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="mt-8 pa-6">
          <v-row no-gutters>
            <v-textarea
              v-model="lecture.description"
              auto-grow
              clearable
              :rows="3"
              dense
              hide-details
              :rules="[(v) => !!v]"
              label="Resumo do palestrante"
            />
          </v-row>
        </v-card>
        <v-row no-gutters class="font-weight-light">
          <v-hover v-slot:default="{ hover }">
            <v-col
              cols="12"
              md="6"
              :class="['pr-md-4 mt-8', hover && 'primary--text'].join(' ')"
            >
              <div style="transition: .5s">Data:</div>
              <v-date-picker
                v-model="lecture.date"
                full-width
                scrollable
                elevation="2"
                locale="pt-br"
                :style="{ ...invalidStyle(datePickerValid), height: '400px' }"
                @input="datePickerValid = true"
              />
            </v-col>
          </v-hover>
          <v-hover v-slot:default="{ hover }">
            <v-col
              cols="12"
              md="6"
              :class="['pl-md-4 mt-8', hover && 'primary--text'].join(' ')"
            >
              <div style="transition: .5s" class="d-flex justify-space-between">
                <div>
                  Horário:
                </div>
                <v-tooltip v-if="lecture.time != ''" top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" @click="lecture.time = ''">
                      close
                    </v-icon>
                  </template>
                  Limpar
                </v-tooltip>
              </div>
              <v-time-picker
                v-model="lecture.time"
                full-width
                format="24hr"
                elevation="2"
                scrollable
                :style="{ ...invalidStyle(timePickerValid), height: '400px' }"
                @input="timePickerValid = true"
              />
            </v-col>
          </v-hover>
        </v-row>
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
            <v-snackbar v-model="fileDimensionsError" color="error">
              A imagem deve ter pelo menos 300px de largura e 250px de altura
            </v-snackbar>
            <v-col cols="12" md="8">
              <v-file-input
                id="file-input"
                ref="fileInput"
                v-model="thumbnailFile"
                :hint="
                  $vuetify.breakpoint.lgAndUp
                    ? 'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
                    : ''
                "
                :hide-details="this.$vuetify.breakpoint.mdAndDown"
                persistent-hint
                label="Capa da palestra"
                accept="image/*"
                prepend-icon="add_a_photo"
                :rules="[
                  (v) =>
                    !!v ||
                    lecture.thumbnail != '' ||
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
                class="d-flex align-center"
                :style="invalidStyle(fileValid)"
                @click="openFileInput"
              >
                <v-img
                  v-if="thumbnailUrl || lecture.thumbnail"
                  max-height="100%"
                  max-width="100%"
                  :src="thumbnailUrl || lecture.thumbnail"
                >
                </v-img>
                <div v-else class="text-center">
                  <div class="subtitle-2 font-weight-light">
                    Tamanho mínimo: {{ minWidth }}x{{ minHeight }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <div v-if="id" class="d-flex justify-center align-center mt-8">
          <v-card class="pb-4 px-4 d-flex">
            <v-row no-gutters>
              <v-text-field
                v-model="lecture.live"
                style="max-width: 215px"
                color="error"
                label="ID da transmissão"
                clearable
                :prepend-icon="mdiYoutube"
                hide-details
              />
              <v-tooltip
                :top="mobile"
                :right="!mobile"
                max-width="300px"
                color="info"
              >
                <template v-slot:activator="{ on }">
                  <v-icon small class="ml-2" v-on="on">info</v-icon>
                </template>
                <div class="my-2">
                  Ao atribuir um ID de transmissão a palestra apresentará um
                  aviso de que está
                  <v-badge color="accent" inline content="Ao vivo" />
                  e a página da palestra ficará disponível para os
                  participantes, até que este ID seja apagado.
                  <br />
                  <br />
                  O ID pode ser encontrado na URL original da transmissão no
                  Youtube, como mostra o exemplo:
                  <v-img
                    class="rounded"
                    :src="require('@/assets/images/yt_id_example.jpg')"
                  />
                </div>
              </v-tooltip>
            </v-row>
          </v-card>
        </div>
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
      Ocorreu um erro ao salvar a palestra (Código {{ error }})
    </v-snackbar>
  </div>
</template>
<script>
import { mdiYoutube } from '@mdi/js'

export default {
  async asyncData({ redirect, $axios, route, app }) {
    let lecture = {
      title: '',
      speaker: '',
      description: '',
      day: '',
      time: '',
      thumbnail: '',
      live: ''
    }

    const id = route.params.id
    if (id !== 'new') {
      try {
        const response = await $axios.get(`/lectures/${route.params.id}`)
        lecture = app.$representers.lecture(response.data)
      } catch {
        redirect('/admin/lectures')
      }
    }
    return { lecture, id: id !== 'new' && id }
  },
  data() {
    return {
      valid: true,
      datePickerValid: true,
      timePickerValid: true,
      fileValid: true,
      thumbnailFile: null,
      draggingOver: 0,
      minWidth: 300,
      minHeight: 250,
      fileFormatError: false,
      fileDimensionsError: false,
      saving: false,
      deleteDialog: false,
      deleting: false,
      error: null,
      mdiYoutube
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    thumbnailUrl() {
      if (this.thumbnailFile) {
        return URL.createObjectURL(this.thumbnailFile)
      }

      return ''
    }
  },
  watch: {
    fileFormatError(error) {
      this.invalidateFileInput(error)
    },
    fileDimensionsError(error) {
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
            if (this.width >= vm.minWidth && this.height >= vm.minHeight) {
              vm.thumbnailFile = file
            } else {
              vm.fileDimensionsError = true
            }
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
      this.fileDimensionsError = false
    },
    invalidateFileInput(error) {
      if (error) {
        this.thumbnailFile = null
        this.fileValid = false
      }
    },
    validate() {
      this.datePickerValid = this.lecture.date != null
      // this.timePickerValid = this.lecture.time !== ''
      this.fileValid = this.$refs.fileInput.validate()
      this.valid =
        this.$refs.form.validate() &&
        this.datePickerValid &&
        this.timePickerValid

      if (this.valid) {
        this.createLecture()
      }
    },
    async createLecture() {
      this.saving = true
      const formData = new FormData()
      Object.keys(this.lecture).forEach((k) => {
        if (this.lecture[k]) formData.set(k, this.lecture[k])
      })

      if (this.thumbnailFile) {
        formData.set('file', this.thumbnailFile)
      }
      try {
        if (!this.id) {
          await this.$axios.post('/lectures', formData)
        } else {
          await this.$axios.put(`/lectures/${this.id}`, formData)
        }
      } catch (err) {
        this.error = err.response.status
      }

      this.saving = false
      this.$router.go(-1)
    },
    async deleteLecture() {
      this.deleting = true
      await this.$axios.delete('/lectures', { params: { ids: [this.id] } })

      this.deleting = false
      this.$router.go(-1)
    }
  }
}
</script>
