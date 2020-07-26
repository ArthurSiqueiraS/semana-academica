import Vue from 'vue'

export default ({ store }) => {
  Vue.prototype.$event = {
    set: (online) => {
      store.commit('event/set', online)
    },
    online() {
      return store.state.event.online
    }
  }
}
