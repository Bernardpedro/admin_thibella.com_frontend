<template>
  <div class="relative">
   <!-- sorting -->
   <div class=" text-white p-2 right-0 flex justify-end space-x-2">
    <span class="mr-2 text-white">Sort by:</span>
    <select v-model="sortOption" class="mr-px p-0 bg-gray-800">
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  </div>
</div>

</template>

<script setup>

import { sortOption} from '~/composables/sorting.js'
</script>
