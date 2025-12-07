export default defineNuxtConfig(
  {  nitro: {
    preset: 'static'
  },
    
    runtimeConfig: {
      public: {
        // API_URL: process.env.BASE_URL,
        baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:8080'
      },
    },
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
        title: 'thibella.com',
        meta: [{ name: 'description', content: 'A Nuxt 3 project using Options API' }],
      },
    },

    modules: [
      '@nuxtjs/i18n',
      'nuxt-icon',
      "@pinia/nuxt",
    ],
    
    imports: {
      dirs: ["stores"], // Auto-import stores
    },

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

    compatibilityDate: '2025-02-09',

    devtools: {
      enabled: true
    },
    typescript: {
      strict: false
    },
    
  })
