<template>
  <header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">

    <!-- Main Header -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0">
          <svg viewBox="0 0 500 110" xmlns="http://www.w3.org/2000/svg" class="h-16 w-auto">
            <!-- Elegant leaf/botanical design -->
            <g id="icon">
              <!-- Main leaves in vibrant green -->
              <path d="M 45 75 Q 30 50, 50 35 Q 58 42, 55 58 Z" fill="#10B981" opacity="0.9">
                <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
              </path>
              <path d="M 75 75 Q 90 50, 70 35 Q 62 42, 65 58 Z" fill="#059669" opacity="0.95">
                <animate attributeName="opacity" values="0.95;1;0.95" dur="3s" repeatCount="indefinite" begin="0.5s"/>
              </path>
              
              <!-- Center leaf -->
              <path d="M 60 30 Q 48 42, 50 62 Q 60 58, 70 62 Q 72 42, 60 30 Z" fill="#34D399"/>
              
              <!-- Bottom stems -->
              <ellipse cx="60" cy="72" rx="10" ry="5" fill="#10B981" opacity="0.7"/>
              
              <!-- Decorative dots -->
              <circle cx="45" cy="50" r="2" fill="#6EE7B7" opacity="0.8"/>
              <circle cx="75" cy="50" r="2" fill="#6EE7B7" opacity="0.8"/>
            </g>
            
            <!-- Brand name with elegant styling -->
            <text x="110" y="95" font-family="Georgia, serif" font-size="64" font-weight="700" letter-spacing="2" fill="#059669" font-style="italic">
              Thibella.
            </text>

            <!-- Smaller "com" text positioned right after "." -->
            <text x="420" y="95" font-family="Georgia, serif" font-size="32" font-weight="400" fill="#059669" font-style="normal" opacity="0.85">
              com
            </text>
            
            <!-- Decorative flourish under the name -->
            <path d="M 110 105 Q 180 108, 250 105 T 390 105" stroke="#10B981" stroke-width="2.5" fill="none" opacity="0.8" stroke-linecap="round"/>
            
            <!-- Elegant accent dots -->
            <circle cx="395" cy="105" r="3" fill="#10B981"/>
            <circle cx="405" cy="105" r="2" fill="#34D399" opacity="0.7"/>
          </svg>
        </NuxtLink>
       <!-- Navigation Menu (Desktop) -->
        <nav class="hidden lg:flex items-center gap-6">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-xl">
          <div class="relative w-full">
            <input 
              type="text"
              :value="searchQuery"
              @input="(e) => performSearch(e.target.value)"
              placeholder="Search products..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </span>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">

          <select
            v-model="currentLanguage"
            class="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300 cursor-pointer"
            style="font-family: system-ui, 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;"
          >
            <option value="en">🇺🇸 English</option>
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="fr">🇫🇷 Français</option>
          </select>


          <!-- Cart -->
          <NuxtLink 
            to="/cart"
            class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Shopping cart"
          >
            <span class="text-2xl">🛒</span>
            <span 
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

          <!-- User Account -->
          <NuxtLink 
            to="/login"
            class="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800  transition-colors hidden sm:block"
            aria-label="User Account"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-300">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">Sign in</span>
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button 
            @click="toggleDarkMode"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Toggle dark mode"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <!-- Mobile Menu Toggle -->
          <button 
            @click="toggleMobileMenu"
            class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <span class="text-2xl">☰</span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div class="md:hidden mt-4">
        <div class="relative">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-show="mobileMenuOpen"
      class="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
    >
      <nav class="container mx-auto px-4 py-4 flex flex-col gap-3">
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
          <NuxtLink 
            to="/account"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
          >
            <span>👤</span>
            <span>My Account</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useSearchStore } from '~/stores/search'
import { useRouter } from 'vue-router'


// USE THE COMPOSABLE!
const { isDark, initDarkMode, toggleDarkMode } = useDarkMode()

// State
const mobileMenuOpen = ref(false)
const currentLanguage = ref('rw')
const router = useRouter()
const searchStore = useSearchStore()
const searchQuery = ref(searchStore.query)
const wishlistCount = ref(5)

// Cart Store
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.cartTotalQuantity.value)

// Set initial currency based on default language
onMounted(() => {
 
  //initialise the dark mode
  initDarkMode()
  
  // Trigger the language change to set initial currency
  currentLanguage.value = currentLanguage.value
})

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}


// const toggleDarkMode = () => {
//   isDark.value = !isDark.value
//   if (isDark.value) {
//     document.documentElement.classList.add('dark')
//   } else {
//     document.documentElement.classList.remove('dark')
//   }
// }

const performSearch = (query) => {
  searchQuery.value = query
  searchStore.setQuery(query)
  // Navigate to home page if not already there
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}

// Initialize dark mode from localStorage or system preference
if (process.client) {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

// Watch language changes and update currency accordingly
watch(currentLanguage, (newLang) => {
  console.log('Language changed to:', newLang)
  // Update currency based on language
  switch(newLang) {
    case 'en':
      cartStore.setCurrency('USD')
      break
    case 'rw':
      cartStore.setCurrency('RWF')
      break
    case 'fr':
      cartStore.setCurrency('EUR')
      break
  }
  // Here you would implement actual language switching logic
})
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color;
  transition-timing-function: ease-in-out;
  transition-duration: 200ms;
}
</style>