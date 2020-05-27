<template>
  <v-app>
    <nuxt />
    <v-fab-transition>
      <v-btn
        v-show="fab"
        v-scroll="onScroll"
        fab
        dark
        fixed
        bottom
        right
        color="secondary"
        @click="toTop"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>
    <Footer />
  </v-app>
</template>

<script>
import Footer from '@/components/layout/Footer'

export default {
  components: {
    Footer
  },
  data: () => ({
    fab: false
  }),
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    }
  }
}
</script>
