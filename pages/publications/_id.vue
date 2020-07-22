<template>
  <div class="d-flex justify-center">
    <v-col cols="12" md="10" lg="8" xl="6">
      <v-img :src="publication.poster" />
    </v-col>
  </div>
</template>
<script>
export default {
  async asyncData({ redirect, $axios, route, app }) {
    try {
      const response = await $axios.get(`/publications/${route.params.id}`)

      const publication = app.$representers.publication(response.data)

      return { publication }
    } catch {}
    redirect('/')
  }
}
</script>
