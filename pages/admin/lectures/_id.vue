<template>
  <div class="d-flex justify-center py-8" style="width: 100%">
    <v-col cols="12" md="8" lg="5">
      <v-form>
        <h2 class="text-uppercase primary--text mb-8 text-center">
          Adicionar Palestra
        </h2>
        <v-card class="px-6 pb-6 pt-3">
          <v-row no-gutters>
            <v-text-field
              v-model="lecture.title"
              hide-details
              clearable
              label="Título da palestra"
              class="pr-8"
            />
            <v-text-field
              v-model="lecture.speaker"
              hide-details
              clearable
              label="Palestrante"
            />
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
              label="Resumo do palestrante"
            />
          </v-row>
        </v-card>
        <v-row no-gutters class="font-weight-light mt-8">
          <v-hover v-slot:default="{ hover }">
            <v-col
              cols="12"
              md="7"
              :class="'pr-8 ' + (hover && 'primary--text')"
            >
              <div style="transition: .5s">Data:</div>
              <v-date-picker
                v-model="lecture.date"
                full-width
                scrollable
                locale="pt-br"
                style="height: 400px"
              />
            </v-col>
          </v-hover>
          <v-hover v-slot:default="{ hover }">
            <v-col cols="12" md="5" :class="hover && 'primary--text'">
              <div style="transition: .5s">Horário:</div>
              <v-time-picker
                v-model="lecture.time"
                full-width
                format="24hr"
                scrollable
                style="height: 400px"
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
              style="cursor: pointer"
              @click="fileFormatError = false"
            >
              Formato de arquivo inválido
            </v-snackbar>
            <v-snackbar v-model="fileDimensionsError">
              A imagem deve ter pelo menos 300px de largura e 250px de altura
            </v-snackbar>
            <v-file-input
              v-model="thumbnailFile"
              :hint="
                $vuetify.breakpoint.lgAndUp &&
                  'Clique para buscar nos seus arquivos ou arraste uma imagem até aqui'
              "
              :hide-details="$vuetify.breakpoint.mdAndDown"
              persistent-hint
              label="Capa da palestra"
              accept="image/*"
              prepend-icon="add_a_photo"
            >
              <template v-slot:selection="{ text }">
                <v-chip small label color="primary">
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <v-card
              outlined
              width="150"
              height="125"
              class="ml-8 d-flex align-center"
            >
              <v-img
                v-if="thumbnailUrl"
                max-height="100%"
                max-width="100%"
                :src="thumbnailUrl"
              >
              </v-img>
              <div v-else class="text-center">
                <v-card-subtitle>
                  Tamanho mínimo: {{ minWidth }}x{{ minHeight }}
                </v-card-subtitle>
              </div>
            </v-card>
          </v-row>
        </v-card>
        <div class="text-center">
          <v-btn color="primary mt-8 px-8">Salvar</v-btn>
        </div>
      </v-form>
    </v-col>
  </div>
</template>
<script>
export default {
  async asyncData({ redirect, $axios, route, app }) {
    let lecture = {
      title: '',
      speaker: '',
      description: '',
      day: '',
      time: '',
      thumbnail: ''
    }
    if (route.params.id !== 'new') {
      try {
        const response = await $axios.get(`/lectures/${route.params.id}`)
        lecture = app.$representers.lecture(response.data)
      } catch {
        redirect('/admin/lectures')
      }
    }
    return { lecture }
  },
  data() {
    return {
      thumbnailFile: null,
      draggingOver: 0,
      minWidth: 300,
      minHeight: 250,
      fileFormatError: false,
      fileDimensionsError: false
    }
  },
  computed: {
    thumbnailUrl() {
      if (this.thumbnailFile) {
        return URL.createObjectURL(this.thumbnailFile)
      }

      return ''
    }
  },
  methods: {
    addDropFile(e) {
      const files = Object.values(e.dataTransfer.files).filter((file) =>
        file.type.split('/').includes('image')
      )
      if (files[0]) {
        const vm = this
        const img = new Image()
        img.src = URL.createObjectURL(files[0])
        img.onload = function() {
          if (this.width >= vm.minWidth && this.height >= vm.minHeight) {
            vm.thumbnailFile = files[0]
          } else {
            vm.fileDimensionsError = true
          }
        }
      } else {
        this.fileFormatError = true
      }
      this.draggingOver = 0
    },
    dropzoneEnter(e) {
      e.preventDefault()

      this.draggingOver++
    },
    dropzoneLeave() {
      this.draggingOver--
    }
  }
}
</script>
