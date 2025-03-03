<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCartStore } from "@/stores/cart"; 
import { formatCurrency } from "@/stores/currencyFormatter";

interface Product {
  id: string; 
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number; 
  keywords: string[]; 
  quantity: number;
  type: string;
}

// cart
const cartStore = useCartStore();
watch(()=>cartStore.cart, (cartAfterUpdate)=> {
  console.log("Cart after updated: ", cartAfterUpdate);
} )

// Functions to handle quantity changes
const increment = (product: Product) => product.quantity++;
const decrement = (product: Product) => {
  if (product.quantity > 1) product.quantity--;
};

//  user selections
const selectedColor = ref("");
const selectedCurrency = ref("RWF");
const selectedShipping = ref("");

// Convert price based on selected currency
const convertPrice = (priceCents: number) => {
  if (selectedCurrency.value === "USD") return parseFloat((priceCents * 0.00071).toFixed(2)) 
  if (selectedCurrency.value === "EUR") return parseFloat((priceCents * 0.00068).toFixed(2))
  if (selectedCurrency.value === "RWF") return parseFloat((priceCents * 1).toFixed(2))
};
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900">
    <section class="bg-white py-8 dark:bg-gray-900 md:py-16">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white uppercase border-b pb-4">
          Shopping Cart
        </h2>

        <div class="mt-6 sm:mt-8 lg:flex lg:items-start xl:gap-8">
          <!-- Left: Products List -->
          <div class="w-full lg:max-w-2xl xl:max-w-4xl">
            <div class="space-y-6">
              <div
                v-for="product in cartStore.cart"
                :key="product.id"
                class="flex items-center border-b pb-6 pt-6 border-gray-200 dark:border-gray-700"
              >
                <input type="checkbox" class="mr-4 w-5 h-5 rounded border-gray-300" />
                <img class="h-24 w-24 object-cover" :src="product.image" :alt="product.name" />
                
                <div class="flex-1 ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
                  <div class="flex gap-2 mt-2">
                    <span class="p-0 text-sm bg-gray-200 rounded">
                      <select v-model="selectedColor" class="border p-1 rounded">
                        <option disabled value="">Choose Color</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                      </select>
                    </span>
                    <span class="p-0 text-sm bg-gray-200 rounded">
                      <select v-model="selectedCurrency"  class="border p-1 w-[120px] rounded">
                        <option disabled value="">currency</option>
                        <option value="RWF">RWF</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EURO</option>
                      </select>
                    </span>
                    <span class="p-0 text-sm bg-gray-200 rounded">
                    <select v-model="selectedShipping" class="border p-1 w-[200px] rounded">
                      <option disabled value="">Choose Shipping</option>
                      <option value="Standard">Standard (5-7 days)</option>
                      <option value="Express">Express (2-3 days)</option>
                      <option value="Overnight">Overnight (1 day)</option>
                    </select>
                    </span>
                  </div>
                  <div class="mt-3 flex gap-4">
                    <button class="text-sm text-blue-500 hover:underline">Move to Favorites</button>
                    <button class="text-sm text-red-500 hover:underline" @click="cartStore.removeFromCart(product.id)">Remove</button>
                  </div>
                </div>

                <div class="flex items-center ml-auto">
                  <button @click="decrement(product)" class="px-2 py-1 text-white ">-</button>
                  <input type="text" :value="product.quantity" readonly class="w-10  text-center bg-slate-500 " />
                  <button @click="increment(product)" class="px-2 py-1 text-white">+</button>
                </div>

                <p v-if="selectedCurrency ==='RWF' " class="ml-6 font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(convertPrice(product.priceCents), selectedCurrency ) }} 
                </p>
                <p v-else class="ml-6 font-semibold text-gray-900 dark:text-white">
                   {{ formatCurrency(convertPrice(product.priceCents), selectedCurrency) }} 
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div class="w-full mt-6 lg:mt-0 lg:w-96">
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>

              <div class="mt-6 space-y-4">
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{{ formatCurrency(convertPrice(cartStore.calculateTotalPrice)), selectedCurrency }}</span>
                </div>

                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div class="flex justify-between text-gray-900 dark:text-white font-bold">
                  <span>Total</span>
                  <span>{{formatCurrency(convertPrice(cartStore.calculateTotalPrice)), selectedCurrency }}</span>
                </div>
              </div>

              <button class="mt-6 w-full rounded-md bg-black text-white py-3 font-semibold hover:bg-gray-800">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
