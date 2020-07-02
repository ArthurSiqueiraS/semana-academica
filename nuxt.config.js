import colors from 'vuetify/es5/util/colors'

const dev = process.env.NODE_ENV === 'development'
const test = process.env.NODE_ENV === 'test'

let baseUrl = ''
if (dev) baseUrl = 'http://192.168.0.8:8000'
else if (test) baseUrl = 'https://semana-academica-medicina-dev.herokuapp.com'
else baseUrl = 'https://semana-academica-medicina.herokuapp.com'

const themes = {
  dark: {
    primary: colors.blue.darken2,
    accent: colors.grey.darken3,
    secondary: '#481973',
    info: colors.grey.base,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
    background: colors.grey.darken5
  },
  light: {
    primary: '#00a398',
    secondary: '#ffffff',
    accent: '#481973',
    info: colors.grey.base,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
    background: colors.grey.lighten5
  }
}

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
    titleTemplate: '%s 2020' + (dev ? ' - Dev' : ''),
    title: process.env.npm_package_title,
    htmlAttrs: {
      lang: 'pt'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1,  maximum-scale=1, user-scalable=no, minimal-ui'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: 'https://sam2020.netlify.app/sam_og.png'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: process.env.npm_package_title
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: process.env.npm_package_description
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      }
    ]
  },
  generate: {
    fallback: true
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: themes.light.primary },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/axios',
    '@/plugins/representers',
    '@/plugins/constants',
    '@/plugins/actioncable-vue',
    '@/plugins/youtube',
    '@/plugins/validations',
    '@/plugins/wip'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics'
  ],
  googleAnalytics: {
    id: 'UA-163245148-2'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage,
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  pwa: {
    manifest: {
      lang: 'pt',
      name: 'Semana Acadêmica de Medicina UFPEL',
      short_name: 'Semana Acadêmica de Medicina',
      description: process.npm_package_description,
      background_color: themes.light.primary
    },
    meta: {
      mobileAppIOS: true,
      name: 'Semana Acadêmica de Medicina UFPEL',
      lang: 'pt',
      ogImage: 'https://sam2020.netlify.app/logo_green.png'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    progress: true,
    credentials: true,
    baseUrl
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
    },
    scopeKey: 'admin'
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
      themes
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
