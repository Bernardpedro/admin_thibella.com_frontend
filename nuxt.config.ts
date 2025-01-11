export default defineNuxtConfig({
  // Add the CSS file
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

  compatibilityDate: '2025-01-11',
});