import Vue from 'vue'

export default ({ store }) => {
  Vue.prototype.$notifications = {
    push: (text, type, timeout = 5000) => {
      store.commit('notifications/reset')
      setTimeout(() => {
        store.commit('notifications/push', { text, type, timeout })
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
