
<!-- pages/orders/[id].vue -->
<template>
  <div>
  <div  class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center text-gray-500 mb-6">
      <NuxtLink to="/" class="hover:text-blue-500">Home</NuxtLink>
      <span class="mx-2">›</span>
      <NuxtLink to="/orders" class="hover:text-blue-500">Orders</NuxtLink>
      <span class="mx-2">›</span>
      <!-- <span v-for="order in userOrders" :key="order.id" class="text-gray-400">ID {{ order.id }}</span> -->
      <span class="text-gray-400">ID {{ order1.id }}</span>
    </div>

    <!-- Order Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-medium">Order ID: {{ order1.id }}</h1>
      <div class="flex space-x-2">
        <button class="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center">
          <span class="mr-2">Invoice</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </button>
        <NuxtLink to="/orders/order-tracking">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
          <span class="mr-2">Track order</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </button>
      </NuxtLink>
      </div>
    </div>

    <!-- Order Details -->
    <div class="flex items-center mb-6">
      <div class="mr-16">
        <span class="text-gray-500">Order date:</span> {{ orderDate  }}
      </div>
      <div class="flex items-center text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
        <span>Estimated delivery: {{ order.estimatedDelivery }}</span>
      </div>
    </div>

    <hr class="border-gray-200 my-6">

    <!-- Products -->
    <div class="space-y-6">
      <div v-for="(product, index) in order.products" :key="index" class="flex">
        <div class="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
          <img :src="product.image" :alt="product.name" class="max-w-full max-h-full object-contain">
        </div>
        <div class="flex-grow">
          <h3 class="text-xl font-medium">{{ product.name }}</h3>
          <div class="text-gray-500">
            {{ product.specifications.join(' | ') }}
          </div>
        </div>
        <div class="text-right">
          <div class="text-xl">${{ product.price.toFixed(2) }}</div>
          <div class="text-gray-500">Qty: {{ product.quantity }}</div>
        </div>
      </div>
    </div>

    <hr class="border-gray-200 my-6">

    <!-- Payment and Delivery Information -->
    <div class="flex">
      <!-- Payment Section -->
      <div class="w-1/2">
        <h3 class="text-xl font-medium mb-4">Payment</h3>
        <div class="flex items-center">
          <span class="mr-2">{{ order.payment.method }} **{{ order.payment.lastDigits }}</span>
          <img :src="order.payment.icon" class="h-6" alt="Payment method">
        </div>
      </div>

      <!-- Delivery Section -->
      <div class="w-1/2">
        <h3 class="text-xl font-medium mb-4">Delivery</h3>
        <div>
          <div class="font-medium text-gray-500">Address</div>
          <div>{{ order.delivery.address.line1 }}</div>
          <div>{{ order.delivery.address.city }}, {{ order.delivery.address.country }}</div>
          <div>{{ order.delivery.phone }}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/order';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const orderStore = useOrderStore();

console.log("orderStore:", orderStore);


// Get the logged-in user's orders
const userOrders = computed(() => orderStore.getOrdersByUserId(authStore.userId));

console.log("User Orders:", userOrders.value);
// console.log('userOrders id noneho:', userOrders.value[0].id);
console.log('userOrders ids:', userOrders.value.map(order => order.id));

// Find the order that matches the route ID 
const order1 = userOrders.value.find(o => String(o.id) === String(route.params.id));
console.log('order1:', order1);
console.log('order1 id:', order1.id);
console.log('ordered items',order1.items);
console.log('order date:', order1.orderDate);


const dateObj = new Date(order1.orderDate);

const formattedDate = dateObj.toLocaleDateString('en-US', {
  weekday: 'short', // "Fri"
  month: 'short',   // "Mar"
  day: '2-digit',   // "28"
  year: 'numeric'   // "2025"
});

const orderDate = formattedDate;

console.log(formattedDate); // "Fri, Mar 28, 2025"



// Find the order that matches the route ID
console.log("Route ID:", route.params.id);

const order = ref({id: '0', orderDate: '', estimatedDelivery: '', products: [], payment: {}, delivery: {address: {line1: '', city: '', country: ''}, phone: ''}});



</script>