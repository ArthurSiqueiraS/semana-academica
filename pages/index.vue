<template>
  <div>
    <v-img max-width="100vw" :src="require('@/assets/images/SAM_capa.jpg')" />
    <LecturesPanel />
  </div>
</template>

<script>
import LecturesPanel from '@/components/LecturesPanel'

export default {
  auth: false,
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
