<template>
  <div>    
    <section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">   
      <!-- Search Bar -->
      <div class="mx-auto max-w-screen-xl px-4 pb-6 2xl:px-0">
        <div class="relative">
          <input
            v-model="query"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 shadow-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary-700"
          />
          
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div class="mb-4 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          <!-- Product Card -->
          <div
            v-for="(product, index) in displayedProducts"
            :key="index"
            class="group block rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <!-- Product Title -->
            <div class="text-center bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400"
              >
                {{ product.name }}
              </p>
            </div>

            <!-- Product Image -->
            <div class="h-48 w-full overflow-hidden rounded-md">
              
              <img
                class=" hidden h-full w-full  transition-opacity duration-300 group-hover:opacity-90 dark:block"
                :src="product.image"
                :alt="product.name"
              />
            </div>

            <!-- Product Details -->
            <div class="pt-4">
              <p class="text-gray-500 dark:text-gray-400">Type: {{ product.type }}</p>
              <div class="mt-3 flex items-center gap-2">
                <!-- Quantity Label and Input -->
                <label
                  for="quantity"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  max="100"
                  step="1"
                  v-model.number="product.quantity"
                  class="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div class="mt-4 flex items-center justify-between gap-2">
                <p class="text-xl font-extrabold leading-tight text-gray-900 dark:text-white">
                  {{ product.priceCents }}
                </p>
                <button
                  type="button"
                  class="add-to-cart-btn relative overflow-hidden rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition-transform duration-300 hover:scale-105 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  @click=""
                >
                  <span class="relative z-10 flex items-center">
                    <svg
                      class="h-5 w-5 mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                    Add to cart
                  </span>
                  <!-- Ripple Effect -->
                  <span
                    class="absolute inset-0 z-0 block scale-0 rounded-full bg-black opacity-20 transition-transform duration-500 group-hover:scale-150"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { sortOption } from '~/composables/sorting.js';

import { products} from '~/composables/productsList.js';

import useSearch from '~/composables/useSearch.js';

const { query, filteredItems } = useSearch(products.value); // Use destructuring


const displayedProducts = computed(() =>{
  return [...filteredItems.value].sort((a, b) => {
    if (sortOption.value === 'price-asc') return a.priceCents - b.priceCents;
    if (sortOption.value === 'price-desc') return b.priceCents - a.priceCents;
    if (sortOption.value === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption.value === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });
}) 

</script>

<style scoped>
.add-to-cart-btn {
  position: relative;
  overflow: hidden;
}
.add-to-cart-btn:hover .ripple {
  transform: scale(1.5);
}
</style>
