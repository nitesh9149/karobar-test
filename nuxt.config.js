/*
 ** This is for GitHub pages
 */
const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
      router: {
        base: '/admin-one-nuxt/',
      },
    }
    : {}

export default {
  /*
   ** Concat router base setting
   */
  ...routerBase,
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  ssr: true,
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://fonts.googleapis.com/css?family=Nunito',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font@5.4.55/css/materialdesignicons.min.css',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    continuous: true,
    duration: 3000,
    color: '#34a77f',
  },
  loadingIndicator: {
    name: 'three-bounce',
    color: '#34a77f',
    background: 'white',
  },
  /*
   ** Global CSS
   */
  css: ['./assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/after-each.js', mode: 'client' },
    { src: '~/plugins/vuelidate' },
    { src: '@/plugins/vue-html2pdf', mode: 'client' },
    { src: '~/plugins/vue3-print-nb' },
    { src: '~/plugins/VueHtmlToPaper' },
    { src: '@/plugins/vue-shortkey.js', mode: 'client' },
    { src: '@/plugins/VNepaliDatePicker.js' },
    { src: '@/plugins/globalFunction.js' },
    { src: '@/plugins/OtpInput.js' },
    { src: '@/plugins/vue-json-excel.js' },
    { src: '@/plugins/VueKhalti.js' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', { materialDesignIcons: false }],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    '@nuxtjs/pwa',
    '@nuxtjs/auth'
  ],
  sentry: {
    dsn: 'https://5718e2c2657e413aaaa5ed8265627be0@o4505561130139648.ingest.sentry.io/4505561143312384',
    config: {
    },
  },
  pwa: {

    manifest: {
      name: 'Karobar',
      theme_color: '#3ab98d',
      background_color: "#ffffff",

    }

  },
  router: {
    middleware: ['auth']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  //  publicRuntimeConfig: {
  //   axios: {
  //     baseURL: 'https://karobar.link'
  //   }
  // },
  axios: {
    baseURL: 'https://backend.karobarapp.com'
    // baseURL: "http://43.200.48.107"
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (!config.externals) {
        config.externals = {}
      }
      // Remove moment.js from chart.js
      // https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
      config.externals.moment = 'moment'
    },
    loaders: {
      scss: {
        sassOptions: {
          quietDeps: true
        }
      }
    }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/verify-phone-otp/', method: 'post', propertyName: 'key' },
          user: { url: '/auth/user/', method: 'get', propertyName: false, },
          logout: { url: '/auth/logout/', method: 'post' }
        },
        tokenType: 'Token',
        tokenName: 'Authorization',
      }
    },
    redirect: {
      logout: '/login',
    },
  }

}
