<template>
  <v-form>
    <v-stepper v-model="e1" class="transparent elevation-0">
      <template>
        <v-stepper-header class="elevation-0">
          <template v-for="n in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="e1 > n"
              :step="n"
              editable
            >
              Step {{ n }}
            </v-stepper-step>

            <v-divider v-if="n !== steps" :key="n"></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>
          </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
    <v-card-actions>
      <v-btn text color="accent" @click="$emit('cancelSubscription')"
        >Já estou inscrito
      </v-btn>
      <v-spacer />
      <v-btn text color="primary" @click="nextStep(e1)">
        Continuar
      </v-btn>
    </v-card-actions>
  </v-form>
</template>
<script>
export default {
  data() {
    return {
      e1: 1,
      steps: 2
    }
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    vertical() {
      this.e1 = 2
      requestAnimationFrame(() => (this.e1 = 1)) // Workarounds
    }
  },

  methods: {
    onInput(val) {
      this.steps = parseInt(val)
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    }
  }
}
</script>
