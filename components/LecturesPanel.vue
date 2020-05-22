<template>
  <div class="py-10">
    <v-row align="center" justify="center" no-gutters>
      <h2 class="primary--text font-weight-bold mb-8">
        PALESTRAS
        <v-divider />
      </h2>
    </v-row>
    <v-tabs v-model="tab" fixed-tabs show-arrows>
      <v-tab v-for="day in days" :key="day">{{ day }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="day in days" :key="day" class="primary--text ma-8">
        <div v-for="(lecture, index) in lectures[day]" :key="index">
          <v-row align="center" class="ma-2">
            <h4 class="font-weight-bold">
              {{ lecture.time }}
            </h4>
            <v-divider vertical class="mx-8 d-none d-md-inline" />
            <div>
              <h3>{{ lecture.title }}</h3>
              <p>{{ lecture.description }}</p>
              <div class="subtitle-2 font-weight-light secondary--text">
                Palestrante: {{ lecture.speaker }}
              </div>
              <v-btn v-if="index == 0" depressed color="primary" class="mt-8"
                >Ir para palestra</v-btn
              >
            </div>
            <v-spacer />
            <img
              class="ma-4"
              src="https://lh3.googleusercontent.com/proxy/n9BEus4hzkceITx7H-I4ajxSQsRjJ6OO5IeDTt5HckgGpwf83LDz68TE77YhEZ-gDOVvgGW3u9q4Ql6HyPit9TSOi9dugicW2ClvTSBqGsr9AiN50P5Nivk"
            />
          </v-row>
          <v-divider v-if="index < lectures[day].length - 1" />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data() {
    return {
      tab: 0,
      lectures: {}
    }
  },
  computed: {
    days() {
      return Object.keys(this.lectures)
    }
  },
  created() {
    this.$axios.get('http://192.168.0.8:8000/lectures').then((response) => {
      const lectures = response.data.data.map(this.$representers.lecture)
      this.lectures = _.groupBy(lectures, (l) => l.day)
    })
  }
}
</script>
<style lang="scss" scoped></style>
