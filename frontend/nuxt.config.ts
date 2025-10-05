export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001'
    }
  },
  components: {
    dirs: ['~/components'],
    global: true
  },
  ui: {
    icons: ['heroicons']
  }
})