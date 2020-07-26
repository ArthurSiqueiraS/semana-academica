export const state = () => ({
  notification: {
    text: null,
    type: null
  }
})

export const mutations = {
  push(state, notification) {
    state.notification = notification
  },
  reset(state) {
    state.notification = {
      text: null,
      type: null
    }
  }
}

export const strict = false
