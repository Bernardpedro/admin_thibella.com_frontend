export default defineNuxtConfig(
  {
   components: true,
  css: ['@/assets/css/tailwind.css'],

  vite: {
    css: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  },

  app: {
    head: {
      title: 'My Nuxt 3 App',
      meta: [{ name: 'description', content: 'A Nuxt 3 project using Options API' }],
    },
  },

  modules: [
    '@nuxtjs/i18n',
    'nuxt-icon'
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json'
      },
      {
        code: 'rw',
        file: 'rw.json'
      }
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'rw',
    strategy: 'no_prefix'
  },

  compatibilityDate: '2025-01-16'
})