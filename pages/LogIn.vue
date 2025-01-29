<template>
  <div :class="darkMode ? 'dark bg-gray-800 text-white' : 'bg-white text-black'" class="min-h-screen">
    <button 
      @click="toggleDarkMode"
      class="p-2 rounded bg-blue-500 text-white dark:bg-blue-700 fixed top-4 right-4"
    >
    <span v-if="darkMode">☀️</span>
    <span v-else>🌙</span>
    </button>
    <LogInComp />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  definePageMeta({
  layout:'empty'
});
  
  // State for dark mode
  const darkMode = ref(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
  
    // Persist dark mode state in localStorage
    localStorage.setItem('darkMode', darkMode.value ? 'true' : 'false');
  
    // Add/remove dark class to the <html> element for Tailwind's dark mode
    const html = document.documentElement;
    if (darkMode.value) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };
  
  // Initialize dark mode based on saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  }
  </script>
  
  <style scoped>
  /* Optional: Add additional custom styles for light and dark themes here */
  </style>
  