<template>
  <div>
    <div>
      <div class="sorry-youtube" />
      <v-expand-transition>
        <div
          v-if="loading"
          class="primary d-flex flex-column align-center justify-center sorry-youtube"
          style=""
        >
          <img
            :src="require('@/assets/images/SAM_short_logo.png')"
            width="300px"
          />
          <div class="white--text title mt-8 text-center" style="width: 250px">
            Entrando na palestra
            <v-progress-linear indeterminate color="white" />
          </div>
        </div>
      </v-expand-transition>
    </div>
    <div class="d-flex flex-column align-center pt-lg-8">
      <youtube
        ref="youtube"
        :width="playerWidth"
        :height="playerHeight"
        :video-id="videoId"
        :player-vars="{
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          mute: 1
        }"
        @playing="playing"
      ></youtube>
      <v-btn @click="player.playVideo()"><v-icon>play</v-icon></v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      videoId: 'iYSv6Dkzde8',
      loading: true
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player
    },
    ratio() {
      if (this.$vuetify.breakpoint.lg) return 0.8
      if (this.$vuetify.breakpoint.xl) return 0.6

      return 1
    },
    playerWidth() {
      return Math.min(this.$vuetify.breakpoint.width * this.ratio, 1080)
    },
    playerHeight() {
      return (this.playerWidth / 16) * 9
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  methods: {
    playVideo() {
      this.player.playVideo()
    },
    async playing() {
      const iframe = await this.player.getIframe()
      console.log(iframe)
      console.log('\\o/ we are watching!!!')
    }
  }
}
</script>
<style lang="scss" scoped>
.sorry-youtube {
  position: absolute;
  height: 100%;
  width: 100%;
  transition-duration: 1s;
}
</style>
