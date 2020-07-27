export const state = () => ({
  notification: {
    text: null,
    type: null,
    timeout: 5000
  }
})

export const mutations = {
  push(state, notification) {
    state.notification = notification
  },
  reset(state) {
    state.notification = {
      text: null,
      type: null,
      timeout: 5000
    }
  }
}

export const strict = false
