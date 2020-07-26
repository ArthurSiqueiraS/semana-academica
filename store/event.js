export const state = () => ({
  online: null
})

export const mutations = {
  set(state, online) {
    state.online = online
  }
}

export const strict = false
