import Vue from 'vue'

export default ({ store }) => {
  Vue.prototype.$notifications = {
    push: (text, type) => {
      store.commit('notifications/reset')
      setTimeout(() => {
        store.commit('notifications/push', { text, type })
      }, 1)
    },
    reset() {
      store.commit('notifications/reset')
    },
    notification() {
      return store.state.notifications.notification
    }
  }
}
