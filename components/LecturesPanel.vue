<template>
  <div>
    <v-tabs v-model="tab" background-color="accent" fixed-tabs show-arrows>
      <v-tab v-for="day in days" :key="day">{{ day }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="day in days" :key="day" class="primary--text">
        <div class="d-flex justify-center">
          <v-col cols="12" md="11" lg="8" xl="6">
            <div v-for="(lecture, index) in lectures[day]" :key="index">
              <div class="d-flex flex-column flex-md-row align-center ma-2">
                <div class="d-flex flex-column align-center">
                  <div class="font-weight-bold px-6">
                    <v-badge
                      color="accent"
                      :value="lecture.live"
                      :left="!mobile"
                      content="Ao vivo"
                      :bottom="mobile"
                    >
                      {{ lecture.time }}
                    </v-badge>
                  </div>
                </div>
                <v-divider vertical class="mr-8 d-none d-md-inline" />
                <v-card height="250" width="300" flat class="my-4 mr-md-6">
                  <v-img
                    width="100%"
                    height="100%"
                    gradient="to bottom left, rgb(76, 30, 118, .15), rgb(0, 163, 152, 0.2)"
                    :src="lecture.thumbnail"
                  />
                </v-card>
                <div class="text-center text-md-left">
                  <h2>{{ lecture.title }}</h2>
                  <h3 class="info--text mt-2">{{ lecture.speaker }}</h3>
                  <div
                    v-for="(line, i) in lecture.description.split('\n')"
                    :key="i"
                    class="info--text"
                  >
                    {{ line }}<br />
                  </div>
                  <div v-if="lecture.live" class="mt-8">
                    <v-btn
                      v-if="$auth.loggedIn"
                      color="accent"
                      depressed
                      :to="lecture.link"
                    >
                      Ir para a transmissão
                    </v-btn>
                    <v-btn v-else depressed rounded color="primary" to="/login"
                      >Inscreva-se para assistir</v-btn
                    >
                  </div>
                </div>
              </div>
              <v-divider v-if="index < lectures[day].length - 1" />
            </div>
          </v-col>
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
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    days() {
      return Object.keys(this.lectures)
    }
  },
  created() {
    this.fetchLectures()
  },
  methods: {
    async fetchLectures() {
      const response = await this.$axios.get('/lectures')

      const lectures = response.data.data.sort((a, b) => {
        return new Date(a.schedule_time) > new Date(b.schedule_time) ? 1 : -1
      })

      this.lectures = _.groupBy(
        lectures.map(this.$representers.lecture),
        (l) => l.day
      )
    }
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
