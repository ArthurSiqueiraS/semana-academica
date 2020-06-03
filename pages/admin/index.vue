<template>
  <div style="height: 100%" class="d-flex align-center justify-center">
    <v-hover
      v-for="option in options"
      v-slot:default="{ hover }"
      :key="option.name"
    >
      <v-card
        color="primary"
        class="d-flex flex-column mx-8"
        width="160"
        height="170"
        :to="option.link"
      >
        <div class="flex-grow-1 d-flex align-center">
          <v-icon
            color="white"
            :size="hover ? '80' : '60'"
            class="flex-grow-1"
            >{{ option.icon }}</v-icon
          >
        </div>
        <v-card-content
          class="accent white--text text-uppercase text-center font-weight-bold py-2"
        >
          {{ option.name }}
        </v-card-content>
      </v-card>
    </v-hover>
  </div>
</template>
<script>
export default {
  middleware({ redirect, $auth }) {
    if (!$auth.hasScope()) {
      redirect('/')
    }
  },
  data() {
    return {
      options: [
        { icon: 'campaign', name: 'Palestras', link: '/admin/lectures' }
      ]
    }
  }
}
</script>
