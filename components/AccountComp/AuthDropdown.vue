<script setup>
import { ref } from 'vue';

const open = ref(false);
let timeout = null;

// Open dropdown on hover
const showDropdown = () => {
  open.value = true;
};

// Close dropdown with a delay
const closeDropdown = () => {
  timeout = setTimeout(() => {
    open.value = false;
  }, 300);
};

// Cancel closing when hovering back
const cancelClose = () => {
  clearTimeout(timeout);
};
</script>

<template>
  <div class="relative inline-block">
    <!-- Sign In Button -->
    <button @mouseover="showDropdown" @mouseleave="closeDropdown" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
      Sign In
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="open" 
      @mouseover="cancelClose" 
      @mouseleave="closeDropdown"
      class="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 transition-opacity duration-300"
    >
      <p class="font-semibold text-gray-700 mb-2">Continue with:</p>

      <!-- Facebook Login -->
      <button class="flex items-center w-full px-4 py-2 border rounded-lg hover:bg-gray-100">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" class="w-6 h-6 mr-2" alt="Facebook Logo">
        Facebook
      </button>

      <!-- Google Login -->
      <button class="flex items-center w-full px-4 py-2 border rounded-lg mt-2 hover:bg-gray-100">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" class="w-6 h-6 mr-2" alt="Google Logo">
        Google
      </button>
    </div>
  </div>
</template>
