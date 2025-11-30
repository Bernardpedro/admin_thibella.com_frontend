<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Order</h2>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Success Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p class="text-gray-600 dark:text-gray-300">Thank you for your purchase</p>
          <div class="mt-4 inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <span class="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
            <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ order.id }}</span>
          </div>
        </div>

        <!-- Order Status -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Order Status</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">Placed on {{ formatDate(order.createdAt) }}</p>
            </div>
            <span :class="statusClass" class="px-4 py-2 rounded-full text-sm font-semibold capitalize">
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.productId" 
                 class="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ item.name }}</h3>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Quantity: {{ item.quantity }}</p>
                  <p v-if="item.selectedColor">
                    Color: <span :class="getColorClass(item.selectedColor)">{{ item.selectedColor }}</span>
                  </p>
                  <p v-if="item.selectedClothingSize">Size: {{ item.selectedClothingSize }}</p>
                  <p v-if="item.selectedShoesSize">Size: {{ item.selectedShoesSize }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(item.priceCents * item.quantity, order.summary.currency) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatCurrency(item.priceCents, order.summary.currency) }} each
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(order.summary.subtotalCents, order.summary.currency) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>{{ formatCurrency(order.summary.shipping, order.summary.currency) }}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div class="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>{{ formatCurrency(order.summary.totalCents, order.summary.currency) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Shipping Info -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Contact Info -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div class="space-y-2 text-sm">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium text-gray-900 dark:text-white">Email:</span><br/>
                {{ order.contactInfo.email }}
              </p>
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-medium text-gray-900 dark:text-white">Phone:</span><br/>
                {{ order.contactInfo.phone }}
              </p>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p class="font-medium text-gray-900 dark:text-white">{{ order.shippingAddress.fullName }}</p>
              <p>{{ order.shippingAddress.addressLine1 }}</p>
              <p v-if="order.shippingAddress.addressLine2">{{ order.shippingAddress.addressLine2 }}</p>
              <p>{{ order.shippingAddress.city }}<span v-if="order.shippingAddress.state">, {{ order.shippingAddress.state }}</span> {{ order.shippingAddress.zipCode }}</p>
              <p>{{ order.shippingAddress.country }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h2>
          <div class="text-sm">
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              <span class="font-medium text-gray-900 dark:text-white">Method:</span> 
              <span class="capitalize">{{ order.payment.method.replace('_', ' ') }}</span>
            </p>
            <div v-if="order.payment.method === 'mobile_money'" class="text-gray-600 dark:text-gray-400">
              <span class="font-medium text-gray-900 dark:text-white">Mobile Money Number:</span> 
              {{ order.payment.details.mobileMoneyNumber }}
            </div>
            <div v-if="order.payment.method === 'bank_account'" class="text-gray-600 dark:text-gray-400">
              <p><span class="font-medium text-gray-900 dark:text-white">Name on Card:</span> {{ order.payment.details.nameOnCard }}</p>
              <p><span class="font-medium text-gray-900 dark:text-white">Card Number:</span> **** **** **** {{ order.payment.details.cardNumber.slice(-4) }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button @click="$router.push('/')" 
                  class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold">
            Continue Shopping
          </button>
          <button @click="$router.push('/orders')" 
                  class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch order data
onMounted(async () => {
  try {
    const orderId = route.params.id;
    
    // 🔥 REPLACE THIS URL WITH YOUR ACTUAL API ENDPOINT
    const response = await fetch(`
http://127.0.0.1:3658/m1/801905-780609-default
/order
`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }
    
    order.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// Format currency
const formatCurrency = (cents, currency) => {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get color class for text
const getColorClass = (color) => {
  const colorMap = {
    'blue': 'text-blue-500',
    'red': 'text-red-500',
    'yellow': 'text-yellow-500',
    'white': 'text-gray-500',
    'green': 'text-green-500',
    'black': 'text-gray-900 dark:text-gray-100'
  };
  return colorMap[color] || 'text-gray-500';
};

// Status badge class
const statusClass = computed(() => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  return classes[order.value?.status] || classes['pending'];
});
</script>