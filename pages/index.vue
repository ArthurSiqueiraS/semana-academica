<template>
  <div>
    <v-parallax src="https://img.rasset.ie/000e8a29-1600.jpg">
      <v-row class="flex-column header" align="center" justify="center">
        <h1 class="display-1 text-center font-weight-light ">
          Semana Acadêmica da Medicina UFPEL
        </h1>
        <h3
          class="title text-center font-weight-bold pt-2 pb-4 font-italic white--text"
        >
          De 27/07 a 31/07
        </h3>
        <v-btn depressed color="primary">INSCREVA-SE AGORA</v-btn>
      </v-row>
    </v-parallax>
    <LecturesPanel />
    <!-- <v-parallax
      height="350"
      src="https://www.evidera.com/wp-content/uploads/2017/10/Publications-Header.jpg"
    /> -->
  </div>
</template>

<script>
import LecturesPanel from '@/components/LecturesPanel'

export default {
  components: {
    LecturesPanel
  }
}
</script>
<style scoped>
.header {
  text-shadow: 3px 3px 9px rgba(0, 0, 0, 0.5);
}
</style>
