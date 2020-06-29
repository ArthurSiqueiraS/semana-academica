<template>
  <div>
    <v-img max-width="100vw" :src="require('@/assets/images/SAM_capa.jpg')" />
    <LecturesPanel />
    <FirstAccess :first-access="false" />
  </div>
</template>

<script>
import LecturesPanel from '@/components/LecturesPanel'
import FirstAccess from '@/components/FirstAccess'

export default {
  auth: false,
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next((vm) => {
        vm.firstAccess = !vm.$auth.loggedIn
      })
    } else next()
  },
  components: {
    LecturesPanel,
    FirstAccess
  },
  data() {
    return {
      firstAccess: false
    }
  }
}
</script>
<style scoped>
.header {
  text-shadow: 3px 3px 9px rgba(0, 0, 0, 0.5);
}
</style>
