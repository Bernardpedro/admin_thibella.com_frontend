<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-6">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
      <!-- Order Summary -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Your Order</h2>
        <div class="border p-4 rounded-lg">
          <div v-for="product in cartStore.cart" :key="product.id" class="flex gap-4">
            <div class="w-20 h-20 bg-gray-300 mb-1">
              <img :src="product.image" :alt="product.name" class="w-20 h-20">
            </div>
            <div>
              <p class="text-gray-500 text-sm">{{ product.name }}</p>
              <h3 class="font-semibold">{{formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency)}}</h3>
              
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <input type="checkbox" id="subscribe" class="mr-2">
            <label for="subscribe" class="text-sm">Subscribe</label>
          </div>
          <div class="mt-4 flex gap-2">
            <input type="text" placeholder="Promo Coupon Code" class="border p-2 w-full rounded">
            <button class="bg-gray-800 text-white px-4 py-2 rounded">Apply</button>
          </div>
          <div class="mt-4 space-y-2 text-right">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>
                <span>
                  {{ formatCurrency(cartStore.convertPrice(cartStore.calculateTotalPrice.value), cartStore.selectedCurrency) }}
                </span>
                
              </span>
            </div>
            <div class="flex justify-between">
              <span>Discount:</span>
              <span> $0.00 </span>
            </div>
            <div class="flex justify-between">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div class="flex justify-between font-semibold mt-2">
              <span>Total:</span>
              <span> <span>
                {{ formatCurrency(cartStore.convertPrice(cartStore.calculateTotalPrice.value), cartStore.selectedCurrency) }}
              </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Checkout</h2>
        <form class="space-y-4">
          <div>
            <h3 class="font-semibold">Phone Number</h3>
            <div class="flex gap-2 mt-2">
              <select class="border p-2 rounded">
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+250">+250</option>
                <option value="+91">+91</option>
                <!-- Add more country codes as needed -->
              </select>
              <input type="text" placeholder="Phone Number" class="border p-2 w-full rounded">
            </div>
            <h3 class="font-semibold">Email</h3>
            <input type="email" placeholder="Enter your email" class="border p-2 w-full rounded" required>
          </div>
          <div>
            <h3 class="font-semibold">Shipping Address</h3>
            <input type="text" placeholder="Country" class="border p-2 w-full rounded mt-2">
            <input type="text" placeholder="Full Name" class="border p-2 w-full rounded mt-2">
            <input type="text" placeholder="Address Line 1" class="border p-2 w-full rounded mt-2">
            <input type="text" placeholder="Address Line 2" class="border p-2 w-full rounded mt-2">
            <div class="flex gap-2 mt-2">
              <input type="text" placeholder="City" class="border p-2 w-full rounded">
              <input type="text" placeholder="State" class="border p-2 w-1/3 rounded">
              <input type="text" placeholder="Zip Code" class="border p-2 w-1/3 rounded">
            </div>
          </div>
          <div>
            <h3 class="font-semibold">Payment Method</h3>
            <select v-model="paymentMethod" class="border p-2 w-full rounded mt-2">
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_account">Bank Account</option>
            </select>
            
            <div v-if="paymentMethod === 'mobile_money'" class="mt-2">
              <input type="text" placeholder="Mobile Money Number" class="border p-2 w-full rounded">
            </div>
            
            <div v-if="paymentMethod === 'bank_account'" class="mt-2">
              <input type="text" placeholder="Name on Card" class="border p-2 w-full rounded mt-2">
              <input type="text" placeholder="Credit Card Number" class="border p-2 w-full rounded mt-2">
              <div class="flex gap-2 mt-2">
                <input type="text" placeholder="MM/YY" class="border p-2 w-1/2 rounded">
                <input type="text" placeholder="CVC" class="border p-2 w-1/2 rounded">
              </div>
            </div>
          </div>
          <NuxtLink to="/orders/orders">
            <button @click="handlePlaceOrder" class="w-full bg-gray-800 text-white py-2 rounded">Place Order</button>
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatCurrency } from '~/stores/currencyFormatter';
import { useCartStore } from '~/stores/cart';
import { useOrderStore } from '~/stores/order';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const orderStore = useOrderStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// load cart when component mounts
cartStore.loadCart();
onMounted(() => {
  cartStore.loadCart();
  console.log("Cart Loaded:", cartStore.cart);
  console.log("Total Items:", cartStore.cart.length);
  console.log("Cart Total Price:", cartStore.calculateTotalPrice.value);
});

// payment method
const paymentMethod = ref('mobile_money');

// Function to handle order placement
const handlePlaceOrder = () => {
  if (!authStore.userId) {
    alert("Please log in first!");
    return;
  }

  const orderId = orderStore.placeOrder(authStore.userId);
  if (orderId) {
    alert(`Order placed successfully! Order ID: ${orderId}`);
    router.push('/orders/orders'); // Redirect to orders page
  }
};
</script>
