<template>
  <div>
    <div>
      <v-expand-transition>
        <div
          v-if="loading"
          :style="{
            position: 'absolute',
            height: '100%',
            width: '100%',
            transitionDuration: transitionDuration + 'ms'
          }"
          class="primary d-flex flex-column align-center justify-center"
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
    <div class="d-flex flex-column align-center pa-lg-8">
      <v-fade-transition>
        <v-card
          v-show="showPlayer"
          id="player"
          tile
          flat
          :ripple="false"
          :style="{ width: playerWidth + 'px', height: playerHeight + 'px' }"
          @mousemove="hoverHud"
          @mouseleave="hideHud"
          @dblclick.prevent="fullscreenToggle"
        >
          <v-overlay absolute :value="mobile" opacity="0" />
          <v-overlay
            absolute
            :value="hud"
            :opacity="playing ? (mobile ? 0 : 0.5) : 1"
          >
            <v-card
              tile
              flat
              :width="playerWidth"
              :height="playerHeight"
              class="transparent d-flex flex-column"
            >
              <div class="d-flex flex-grow-1 align-center justify-center">
                <div v-if="!playing && !buffering" class="text-center">
                  <v-btn
                    :x-large="!mobile"
                    class="mb-2 mb-md-4 mb-lg-8"
                    fab
                    outlined
                    @click="playing ? stop() : play()"
                  >
                    <v-icon x-large>play_arrow</v-icon>
                  </v-btn>
                  <div class="title">
                    A transmissão foi interrompida
                  </div>
                  <div class="subtitle-1">
                    Clique para voltar a assistir ao vivo
                  </div>
                </div>
                <div v-if="buffering">
                  <v-progress-circular indeterminate />
                </div>
              </div>
              <div class="mt-auto mx-8">
                <v-divider />
                <v-toolbar
                  color="transparent"
                  flat
                  @mouseenter="maintainHud = true"
                  @mouseleave="maintainHud = false"
                >
                  <v-btn
                    fab
                    small
                    :x-small="mobile"
                    depressed
                    color="primary"
                    :disabled="buffering"
                    @click="playing ? stop() : play()"
                  >
                    <v-icon>{{ playing ? 'stop' : 'play_arrow' }}</v-icon>
                  </v-btn>
                  <v-spacer />
                  <div style="width: 160px" class="mx-4">
                    <v-slider
                      v-model="volume"
                      hide-details
                      color="primary"
                      :prepend-icon="volumeIcon"
                      @click:prepend="volume = 0"
                    />
                  </div>
                  <v-btn icon @click="fullscreenToggle"
                    ><v-icon>fullscreen</v-icon></v-btn
                  >
                </v-toolbar>
              </div>
            </v-card>
          </v-overlay>
          <youtube
            ref="youtube"
            width="100%"
            height="100%"
            :video-id="videoId"
            :player-vars="{
              autoplay: 1,
              controls: 0,
              mute: 1
            }"
            @playing=";(playing = true), (buffering = false)"
            @buffering="buffering = true"
            @ready="loadPlayer"
          ></youtube>
        </v-card>
      </v-fade-transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      videoId: 'i3gIkjwPm-k',
      loading: true,
      transitionDuration: 1000,
      showPlayer: false,
      playing: false,
      buffering: false,
      maintainHud: false,
      fullscreen: false,
      volume: 50,
      hover: 0,
      hovers: 0,
      mobileHud: false
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    player() {
      return this.$refs.youtube && this.$refs.youtube.player
    },
    ratio() {
      if (this.$vuetify.breakpoint.lg) return 0.8
      if (this.$vuetify.breakpoint.xl) return 0.6

      return 1
    },
    playerWidth() {
      if (this.fullscreen) {
        return window.innerWidth
      } else {
        return Math.min(this.$vuetify.breakpoint.width * this.ratio, 1080)
      }
    },
    playerHeight() {
      return (this.playerWidth / 16) * 9
    },
    hud() {
      return (
        this.hover ||
        !this.playing ||
        this.buffering ||
        this.maintainHud ||
        (this.mobile && this.mobileHud)
      )
    },
    volumeIcon() {
      if (this.volume >= 70) return 'volume_up'
      if (this.volume > 0) return 'volume_down'
      return 'volume_mute'
    }
  },
  watch: {
    volume(value) {
      this.player.setVolume(value)
    }
  },
  mounted() {
    const vm = this
    document.addEventListener('fullscreenchange', function() {
      vm.fullscreen = !vm.fullscreen
    })
  },
  methods: {
    hoverHud() {
      this.hover++
      const hoverCount = this.hovers
      setTimeout(() => {
        if (this.hover > 0 && hoverCount === this.hovers) this.hover--
      }, 1500)
    },
    hideHud() {
      setTimeout(() => {
        this.hover = 0
      }, 100)
      this.hovers++
    },
    loadPlayer() {
      this.play()
      this.player.mute()

      const time = this.mobile ? 8000 : 6000
      setTimeout(() => {
        setTimeout(() => {
          this.showPlayer = true
          this.player.unMute()
        }, this.transitionDuration)
        this.loading = false
      }, time)
    },
    play() {
      this.player.playVideo()
    },
    stop() {
      this.playing = false
      setTimeout(() => {
        this.player.stopVideo()
      }, 250)
    },
    fullscreenToggle() {
      if (this.fullscreen) {
        document.exitFullscreen()
      } else {
        document.getElementById('player').requestFullscreen()
      }
    }
  }
}
</script>
