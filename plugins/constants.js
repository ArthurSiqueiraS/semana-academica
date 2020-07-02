import Vue from 'vue'

const constants = {
  $SITE_URL: 'https://sam2020.netlify.app'
}

Object.keys(constants).forEach((key) => {
  Vue.prototype[key] = constants[key]
})

export default constants
