
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
    }
    
  })