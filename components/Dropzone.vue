<template>
  <v-card
    class="mt-8 pa-6"
    @dragenter="dropzoneEnter"
    @dragleave="dropzoneLeave"
    @drop.prevent="
      (e) => {
        dropHandler(e)
        draggingOver = 0
      }
    "
    @dragover.prevent
  >
    <v-overlay color="primary" opacity="1" absolute :value="draggingOver">
      Solte para adicionar o arquivo
    </v-overlay>
    <v-row v-cloak no-gutters align="center">
      <slot>
        <v-text-field />
      </slot>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    dropHandler: {
      type: Function,
      default: (e) => {}
    }
  },
  data() {
    return {
      draggingOver: 0
    }
  },
  methods: {
    dropzoneEnter(e) {
      e.preventDefault()

      this.draggingOver++
    },
    dropzoneLeave() {
      this.draggingOver--
    }
  }
}
</script>
