<template>
  <div>
    <v-tabs v-model="tab" background-color="accent" fixed-tabs show-arrows>
      <v-tab v-for="day in days" :key="day">{{ day }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="day in days" :key="day" class="primary--text pa-8">
        <div
          v-for="(lecture, index) in lectures[day]"
          :key="index"
          class="px-md-12"
        >
          <div class="d-flex flex-column flex-md-row align-center ma-2">
            <h4 class="font-weight-bold">
              {{ lecture.time }}
            </h4>
            <v-divider vertical class="mx-8 d-none d-md-inline" />
            <v-card flat class="my-4 mr-md-6">
              <v-img
                max-width="300"
                max-height="250"
                gradient="to bottom left, rgb(76, 30, 118, .15), rgb(0, 163, 152, 0.2)"
                :src="lecture.thumbnail"
              />
            </v-card>
            <div class="text-center text-md-left">
              <h2>{{ lecture.title }}</h2>
              <h3 class="info--text mt-2">{{ lecture.speaker }}</h3>
              <p class="info--text">
                {{ lecture.description }}
              </p>
            </div>
          </div>
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
h2 {
  line-height: 28px;
}

.v-tab {
  color: white !important;

  &:not(.v-tab--active) {
    opacity: 0.5;
  }
}
</style>
