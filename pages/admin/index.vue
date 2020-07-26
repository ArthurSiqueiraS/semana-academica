<template>
  <div
    style="height: 100%"
    class="d-flex flex-column flex-md-row align-center justify-center py-4"
  >
    <v-hover v-slot:default="{ hover }">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-card
            :color="
              updatingEvent ? 'accent' : eventOnline ? 'success' : 'error'
            "
            class="d-flex flex-column mx-8 my-4"
            width="180"
            height="190"
            :disabled="updatingEvent"
            v-on="on"
            @click="toggleEventStatus"
          >
            <div class="flex-grow-1 d-flex align-center">
              <v-progress-circular
                v-if="updatingEvent"
                color="white"
                class="flex-grow-1"
                indeterminate
              />
              <v-icon
                v-else
                color="white"
                :size="hover ? '90' : '70'"
                class="flex-grow-1"
                >{{
                  eventOnline ? 'check_circle_outline' : 'highlight_off'
                }}</v-icon
              >
            </div>
            <div
              v-if="!updatingEvent"
              class="white--text text-uppercase text-center font-weight-bold py-2"
            >
              Evento {{ eventOnline ? 'aberto' : 'fechado' }}
            </div>
          </v-card>
        </template>
        {{ eventOnline ? 'Fechar' : 'Abrir' }} evento
      </v-tooltip>
    </v-hover>
    <v-hover
      v-for="option in options"
      v-slot:default="{ hover }"
      :key="option.name"
    >
      <v-card
        color="primary"
        class="d-flex flex-column mx-8 my-4"
        width="180"
        height="190"
        :to="option.link"
      >
        <div class="flex-grow-1 d-flex align-center">
          <v-icon
            color="white"
            :size="hover ? '90' : '70'"
            class="flex-grow-1"
            >{{ option.icon }}</v-icon
          >
        </div>
        <div
          class="accent white--text text-uppercase text-center font-weight-bold py-2"
        >
          {{ option.name }}
        </div>
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
        { icon: 'person', name: 'Inscrições', link: '/admin/users' },
        { icon: 'campaign', name: 'Palestras', link: '/admin/lectures' },
        {
          icon: 'library_books',
          name: 'Mostra Científica',
          link: '/admin/publications'
        }
      ],
      updatingEvent: true
    }
  },
  computed: {
    eventOnline() {
      return this.$event.online()
    }
  },
  watch: {
    eventOnline() {
      this.updatingEvent = false
    }
  },
  created() {
    if (this.eventOnline != null) this.updatingEvent = false
  },
  methods: {
    async toggleEventStatus() {
      this.updatingEvent = true

      await this.$axios.post('/event/set', { online: !this.eventOnline })
      this.$cable.perform({
        channel: 'SessionChannel',
        room: 'public',
        action: 'update_event'
      })
    }
  }
}
</script>
