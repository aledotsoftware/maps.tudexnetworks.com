// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, // MapLibre requires window object
  app: {
    head: {
      title: 'GeoCore Map Engine',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000',
      tileUrl: process.env.NUXT_PUBLIC_TILE_URL || 'http://localhost:3000'
    }
  }
})
