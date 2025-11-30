<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900">
      <!-- Order Summary -->
      <div>
        <h2 class="text-xl font-semibold mb-4 dark:text-white">Review Your Order :</h2>
        <div class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <div v-for="product in cartStore.cart" :key="product.id" class="flex gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
            <div class="w-24 h-24 bg-gray-300 dark:bg-gray-600 mb-1">
              <img :src="product.image" :alt="product.name" class="w-24 h-24 object-cover rounded" />
            </div>
            <div class="flex-1 space-y-2">
              <p class="text-gray-500 dark:text-gray-300 text-sm">{{ product.name }}</p>
              <p class="dark:text-gray-300"><span class="font-semibold text-sm">Quantity:</span> {{ product.quantity }}</p>
              <p class="text-gray-500 text-sm">Color: 
                <span :class="{
                  'text-blue-500': product.selectedColor === 'blue',
                  'text-red-500': product.selectedColor === 'red', 
                  'text-yellow-500': product.selectedColor === 'yellow',
                  'text-gray-500': product.selectedColor === 'white',
                  'text-green-500': product.selectedColor === 'green'
                }">
                  {{ product.selectedColor }}
                </span>
              </p>
              <p class="dark:text-gray-300"><span 
                v-if="product.selectedClothingSize"
                class="font-semibold text-sm dark:text-white">Size:</span> {{ product.selectedClothingSize }}</p>
                <span v-if="product.selectedShoesSize" class="font-semibold text-sm dark:text-white">Size:</span> <span class="dark:text-gray-300">{{ product.selectedShoesSize }}</span>
              <h3 class="font-semibold text-sm dark:text-white">{{formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency)}}</h3>
              
            </div>
          </div>

          <div class="mt-4 space-y-2 text-right">
            <div class="flex justify-between dark:text-gray-300">
              <span>Subtotal:</span>
              <span>
                <span>
                  {{ formatCurrency(cartStore.convertPrice(cartStore.calculateTotalPrice.value), cartStore.selectedCurrency) }}
                </span>
                
              </span>
            </div>

            <div class="flex justify-between dark:text-gray-300">
              <span>Shipping:</span>
              <span class="dark:text-gray-200">{{ cartStore.getShippingCost() }}</span>
            </div>
            <div class="flex justify-between font-semibold mt-2 dark:text-white">
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
        <h2 class="text-xl font-semibold mb-4 dark:text-white">Checkout</h2>
        <form class="space-y-4">
          <div>
            <h3 class="font-semibold dark:text-gray-200">Phone Number</h3>
            <div class="flex gap-2 mt-2">
              <select class="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 dark:text-white" v-model="formData.countryCode" >
                <option v-for="country in countryCodes" :key="country.code" :value="country.code">
                  {{country.flag}} {{country.code}}
                </option>
                <!-- Add more country codes as needed -->
              </select>
              <input type="text" placeholder="Phone Number" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white" v-model="formData.phoneNumber">
            </div>
            <h3 class="font-semibold dark:text-gray-200">Email</h3>
            <input type="email" placeholder="Enter your email" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white" required v-model="formData.email">
          </div>
          <div>
            <h3 class="font-semibold dark:text-gray-200">Shipping Address</h3>
            <input type="text" placeholder="Country" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-700 dark:text-white" v-model="formData.country">
            <input type="text" placeholder="Full Name" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-700 dark:text-white" v-model="formData.fullName">
            <input type="text" placeholder="Address Line 1" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-700 dark:text-white" v-model="formData.addressLine1">
            <input type="text" placeholder="Address Line 2" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-700 dark:text-white" v-model="formData.addressLine2">
            <div class="flex gap-2 mt-2">
              <input type="text" placeholder="City" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white" v-model="formData.city">
              <input type="text" placeholder="State" class="border border-gray-300 dark:border-gray-600 p-2 w-1/3 rounded bg-white dark:bg-gray-700 dark:text-white" v-model="formData.state">
              <input type="text" placeholder="Zip Code" class="border border-gray-300 dark:border-gray-600 p-2 w-1/3 rounded bg-white dark:bg-gray-700 dark:text-white" v-model="formData.zipCode">
            </div>
          </div>
          <div>
            <h3 class="font-semibold dark:text-gray-200">Payment Method</h3>
            <select v-model="formData.paymentMethod" class="border border-gray-300 dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-700 dark:text-white">
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_account">Bank Account</option>
            </select>
            
            <div v-if="formData.paymentMethod === 'mobile_money'" class="mt-2">
              <input type="text" placeholder="Mobile Money Number" class="border p-2 w-full rounded"  v-model="formData.mobileMoneyNumber">
            </div>
            
            <div v-if="formData.paymentMethod === 'bank_account'"  class="mt-2">
              <input type="text" placeholder="Name on Card" class="border p-2 w-full rounded mt-2"  v-model="formData.nameOnCard">
              <input type="text" placeholder="Credit Card Number" class="border p-2 w-full rounded mt-2" v-model="formData.cardNumber">
              <div class="flex gap-2 mt-2">
                <input type="text" placeholder="MM/YY" class="border p-2 w-1/2 rounded dark:bg-gray-700 dark:text-white" v-model="formData.cardExpiry">
                <input type="text" placeholder="CVC" class="border p-2 w-1/2 rounded dark:bg-gray-700 dark:text-white" v-model="formData.cardCVC">
              </div>
            </div>
          </div>
          <div class="mt-6">
            <button type="button" @click="handlePlaceOrder" class="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-800">Place Order</button>
          </div>  
            </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { formatCurrency } from '~/stores/currencyFormatter';
import { useCartStore } from '~/stores/cart';
import { useOrderStore } from '~/stores/order';
import { useAuthStore } from '~/stores/auth';

// filling the checkout form


const formData = ref({
  // Phone info
  countryCode: '+1',
  phoneNumber: '',
  email: '',
  
  // Shipping address
  country: '',
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  
  // Payment info
  paymentMethod: 'mobile_money',
  mobileMoneyNumber: '',
  nameOnCard: '',
  cardNumber: '',
  cardExpiry: '',
  cardCVC: '',
  
  // Additional options
  isSubscribed: false,
  promoCode: ''
});

// countries code and flags
const countryCodes = [
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  
];

const orderStore = useOrderStore();
const cartStore = useCartStore();
const router = useRouter();

// load cart when component mounts
cartStore.loadCart();
onMounted(() => {
  cartStore.loadCart();
});

// payment method
const paymentMethod = ref('mobile_money');

// Function to handle order placement
const handlePlaceOrder = async () => {


       // Create the shipping and payment info to attach to the order as metadata
       const orderMetadata = {
      contactInfo: {
        email: formData.value.email,
        phone: formData.value.countryCode + formData.value.phoneNumber
      },
      shippingAddress: {
        country: formData.value.country,
        fullName: formData.value.fullName,
        addressLine1: formData.value.addressLine1,
        addressLine2: formData.value.addressLine2,
        city: formData.value.city,
        state: formData.value.state,
        zipCode: formData.value.zipCode
      },
      payment: {
        method: formData.value.paymentMethod,
        details: formData.value.paymentMethod === 'mobile_money' 
          ? { mobileMoneyNumber: formData.value.mobileMoneyNumber }
          : { 
              nameOnCard: formData.value.nameOnCard,
              cardNumber: formData.value.cardNumber,
              cardExpiry: formData.value.cardExpiry,
              cardCVC: formData.value.cardCVC
            }
      },
      subscription: formData.value.isSubscribed,
      promoCode: formData.value.promoCode,
      currency: cartStore.selectedCurrency


  }

      // router.push(`/orders/${order.id}`);
      router.push("/orders/order");
};
</script>
