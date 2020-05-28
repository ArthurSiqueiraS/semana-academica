<template>
  <div>
    <v-tabs v-model="tab" background-color="accent" fixed-tabs show-arrows>
      <v-tab v-for="day in days" :key="day">{{ day }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="day in days" :key="day" class="primary--text pa-8">
        <div v-for="(lecture, index) in lectures[day]" :key="index">
          <v-row align="center" class="ma-2">
            <h4 class="font-weight-bold">
              {{ lecture.time }}
            </h4>
            <v-divider vertical class="mx-8 d-none d-md-inline" />
            <div>
              <h3>{{ lecture.title }}</h3>
              <p>{{ lecture.description }}</p>
              <div class="subtitle-2 font-weight-light info--text">
                Palestrante: {{ lecture.speaker }}
              </div>
            </div>
            <v-spacer />
            <img class="ma-4" :src="lecture.thumbnail" />
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
    this.$axios.get('/lectures').then((response) => {
      const lectures = response.data.data.map(this.$representers.lecture)
      this.lectures = _.groupBy(lectures, (l) => l.day)
    })
  }
}
</script>
<style lang="scss" scoped>
.v-tab {
  color: white !important;

  &:not(.v-tab--active) {
    opacity: 0.5;
  }
}
</style>
