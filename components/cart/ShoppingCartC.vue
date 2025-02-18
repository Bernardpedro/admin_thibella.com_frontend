<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart : Items()</h2>
        
        <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <!-- Cart Items Section -->
          <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div class="space-y-6">
              <div v-for="(item, index) in cartItems" :key="index" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <NuxtLink :to="item.link" class="shrink-0 md:order-1">
                    <img class="h-20 w-20 dark:hidden" src="assets/img/apple-watch.png"  :alt="item.name" />
                    <img class="hidden h-20 w-20 dark:block" :src="item.darkImage" :alt="item.name" />
                  </NuxtLink>

                  <div class="flex items-center justify-between md:order-3 md:justify-end">
                    <div class="flex items-center">
                      <button @click="decrementQuantity(index)" class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                        <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                        </svg>
                      </button>
                      <input type="text" v-model="item.quantity" class="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white" />
                      <button @click="incrementQuantity(index)" class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                        <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                    <div class="text-end md:order-4 md:w-32">
                      <p class="text-base font-bold text-gray-900 dark:text-white">${{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                  </div>

                  <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <NuxtLink :to="item.link" class="text-base font-medium text-gray-900 hover:underline dark:text-white">
                      {{ item.name }}
                    </NuxtLink>

                    <div class="flex items-center gap-4">
                      <button @click="toggleFavorite(index)" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                        <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                        </svg>
                        Add to Favorites
                      </button>

                      <button @click="removeItem(index)" class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500">
                        <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Shipping Option Radio Button -->
                  <div class="mt-4">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Select Shipping</label>
                    <div>
                      <input type="radio" id="standardShipping" v-model="item.shipping" value="standard" />
                      <label for="standardShipping" class="ml-2 text-sm">Standard Shipping</label>
                    </div>
                    <div>
                      <input type="radio" id="expressShipping" v-model="item.shipping" value="express" />
                      <label for="expressShipping" class="ml-2 text-sm">Express Shipping</label>
                    </div>
                  </div>

                  <!-- Update Button -->
                  <div class="mt-4 flex justify-between">
                    <button v-if="!item.isUpdating" @click="toggleUpdate(index)" class="text-sm text-blue-500 hover:underline">Update</button>

                    <div v-if="item.isUpdating" class="flex gap-2">
                      <input v-model="item.newQuantity" type="number" class="w-16 border p-1 rounded-md" min="1" />
                      <button @click="saveUpdate(index)" class="text-sm text-green-500 hover:underline">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Section -->
          <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p class="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

              <div class="space-y-4">
                <div class="space-y-2">
                  <dl v-for="(summary, index) in orderSummary" :key="index" class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 dark:text-gray-400">{{ summary.label }}</dt>
                    <dd :class="summary.class">{{ summary.value }}</dd>
                  </dl>
                </div>

                <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd class="text-base font-bold text-gray-900 dark:text-white">${{ formatPrice(total) }}</dd>
                </dl>
              </div>

              <NuxtLink to="/checkOut" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Proceed to Checkout
              </NuxtLink>

              <div class="flex items-center justify-center gap-2">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">or</span>
                <NuxtLink to="/shop" class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                  Continue Shopping
                  <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <!-- Voucher Section -->
            <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form @submit.prevent="applyVoucher" class="space-y-4">
                <div>
                  <label for="voucher" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Do you have a voucher or gift card?
                  </label>
                  <input
                    v-model="voucherCode"
                    type="text"
                    id="voucher"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required
                  />
                </div>
                <button type="submit" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Apply Code
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

// import { ref, computed } from 'vue';

definePageMeta({
  layout:'empty'
});

const cartItems = ref([
  {
    name: 'PC system All in One APPLE iMac (2023)',
    price: 1499,
    quantity: 2,
    lightImage: '/api/placeholder/80/80',
    darkImage: '/api/placeholder/80/80',
    link: '#',
    shipping: 'standard', // Added shipping option
    isUpdating: false, // Added flag to toggle update mode
    newQuantity: 2, // Added for new quantity input
  },
  {
    name: 'Restored Apple Watch Series 8',
    price: 598,
    quantity: 1,
    lightImage: '/api/placeholder/80/80',
    darkImage: '/api/placeholder/80/80',
    link: '#',
    shipping: 'standard',
    isUpdating: false,
    newQuantity: 1,
  },
  // Add more items as needed
]);

const voucherCode = ref('');
const savings = ref(299);
const shipping = ref(99);
const tax = ref(799);

const orderSummary = computed(() => [
  {
    label: 'Original price',
    value: `$${formatPrice(subtotal.value)}`,
    class: 'text-base font-medium text-gray-900 dark:text-white'
  },
  {
    label: 'Savings',
    value: -`$${formatPrice(savings.value)}`,
    class: 'text-base font-medium text-green-600'
  },
  {
    label: 'Store Pickup',
    value: `$${formatPrice(shipping.value)}`,
    class: 'text-base font-medium text-gray-900 dark:text-white'
  },
  {
    label: 'Tax',
    value: `$${formatPrice(tax.value)}`,
    class: 'text-base font-medium text-gray-900 dark:text-white'
  }
]);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
  return subtotal.value - savings.value + shipping.value + tax.value;
});

function formatPrice(price) {
  return price.toFixed(2);
}

function incrementQuantity(index) {
  cartItems.value[index].quantity++;
}

function decrementQuantity(index) {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
  }
}

function removeItem(index) {
  cartItems.value.splice(index, 1);
}

function toggleFavorite(index) {
  console.log('Toggle favorite for item:', cartItems.value[index].name);
}

function toggleUpdate(index) {
  cartItems.value[index].isUpdating = !cartItems.value[index].isUpdating;
}

function saveUpdate(index) {
  cartItems.value[index].quantity = cartItems.value[index].newQuantity;
  cartItems.value[index].isUpdating = false;
}

function applyVoucher() {
  console.log('Applying voucher:', voucherCode.value);
  voucherCode.value = '';
}
</script>
