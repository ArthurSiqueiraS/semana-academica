import colors from 'vuetify/es5/util/colors'

const dev = process.env.NODE_ENV === 'development'
const baseUrl = dev
  ? 'http://192.168.0.8:8000'
  : 'https://semana-academica-medicina.herokuapp.com/'

export default {
  env: {
    baseUrl
  },
  mode: 'spa',
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s' + (dev ? ' - Dev' : ''),
    title: 'Semana Acadêmica de Medicina UFPEL 2020',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'XXXVI Semana Acadêmica de Medicina UFPEL- de 27/07 a 31/07'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon_2.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/axios', '@/plugins/representers'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage,
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    progress: true,
    credentials: true
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: baseUrl + '/login',
            method: 'post',
            propertyName: 'token',
            headers: { 'Content-Type': 'application/json' }
          },
          user: {
            url: baseUrl + '/user',
            method: 'get',
            propertyName: false
          }
        }
      }
    },
    redirect: {
      login: '/'
    }
  },
  router: {
    middleware: ['auth']
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: '#481973',
          info: colors.grey.base,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#00a398',
          secondary: '#ffffff',
          accent: '#481973',
          info: colors.grey.base,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
