<template>
  <div class="d-flex justify-center py-8" style="width: 100%">
    <v-col cols="12" md="8" lg="5">
      <v-form>
        <v-row>
          <v-text-field
            v-model="lecture.title"
            label="Título da palestra"
            class="mr-8"
          />
          <v-text-field v-model="lecture.speaker" label="Palestrante" />
        </v-row>
        <v-row>
          <v-textarea
            v-model="lecture.description"
            label="Resumo do palestrante"
          />
        </v-row>
        <v-row class="d-flex justify-space-between text-center">
          <div>
            <h4>Data:</h4>
            <v-date-picker
              v-model="lecture.date"
              locale="pt-br"
              style="height: 400px"
            />
          </div>
          <div>
            <h4>Horário:</h4>
            <v-time-picker
              v-model="lecture.time"
              format="24hr"
              scrollable
              style="height: 400px"
            />
          </div>
        </v-row>
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
  }
}
</script>
