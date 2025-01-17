<template>
  <TransitionRoot appear :show="isVisible" as="template">
    <div 
      id="banner" 
      tabindex="-1" 
      class="fixed top-0 left-0 right-0 z-[60] flex w-full items-start justify-between gap-8 border-b border-gray-200 bg-gray-50 px-4 py-3 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:items-center lg:py-4"
      style="margin-top: 0;"
    >
      <p class="mx-auto text-base text-gray-500 dark:text-gray-400">
        <span class="font-medium text-gray-900 dark:text-white">Autumn Sale is Here!</span> 
        🌟 Whether you're prepping for cooler days or refreshing your home, now's the time 
        <a 
          href="#" 
          class="font-medium text-gray-900 underline hover:no-underline dark:text-white"
        >
          to shop!
        </a>
      </p>
      <button 
        type="button" 
        class="flex items-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        @click="closeBanner"
      >
        <svg 
          class="h-5 w-5" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill-rule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TransitionRoot } from '@headlessui/vue'

const isVisible = ref(true)

// Check if banner was previously closed
onMounted(() => {
  const bannerClosed = localStorage.getItem('banner-closed')
  if (bannerClosed) {
    isVisible.value = false
  }
})

const closeBanner = () => {
  isVisible.value = false
  // Store banner state in localStorage
  localStorage.setItem('banner-closed', 'true')
}
</script>

<style scoped>
:deep(.v-enter-active),
:deep(.v-leave-active) {
  transition: all 0.3s ease;
}

:deep(.v-enter-from),
:deep(.v-leave-to) {
  opacity: 0;
  transform: translateY(-100%);
}
</style>