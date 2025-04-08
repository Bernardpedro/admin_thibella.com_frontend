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
          <!-- <div class="mt-4 flex items-center gap-2">
            <input type="checkbox" id="subscribe" class="mr-2" v-model="formData.isSubscribed">>
            <label for="subscribe" class="text-sm">Subscribe</label>
          </div>
          <div class="mt-4 flex gap-2">
            <input type="text" placeholder="Promo Coupon Code" class="border p-2 w-full rounded" v-model="formData.promoCode">
            <button class="bg-gray-800 text-white px-4 py-2 rounded">Apply</button>
          </div> -->
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
              <span>{{ cartStore.getShippingCost() }}</span>
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
              <select class="border p-2 rounded" v-model="formData.countryCode" >
                <option v-for="country in countryCodes" :key="country.code" :value="country.code">
                  {{country.flag}} {{country.code}}
                </option>
                <!-- Add more country codes as needed -->
              </select>
              <input type="text" placeholder="Phone Number" class="border p-2 w-full rounded"  v-model="formData.phoneNumber">
            </div>
            <h3 class="font-semibold">Email</h3>
            <input type="email" placeholder="Enter your email" class="border p-2 w-full rounded" required v-model="formData.email">
          </div>
          <div>
            <h3 class="font-semibold">Shipping Address</h3>
            <input type="text" placeholder="Country" class="border p-2 w-full rounded mt-2" v-model="formData.country">
            <input type="text" placeholder="Full Name" class="border p-2 w-full rounded mt-2" v-model="formData.fullName">
            <input type="text" placeholder="Address Line 1" class="border p-2 w-full rounded mt-2"  v-model="formData.addressLine1">
            <input type="text" placeholder="Address Line 2" class="border p-2 w-full rounded mt-2" v-model="formData.addressLine2">
            <div class="flex gap-2 mt-2">
              <input type="text" placeholder="City" class="border p-2 w-full rounded" v-model="formData.city">
              <input type="text" placeholder="State" class="border p-2 w-1/3 rounded" v-model="formData.state">
              <input type="text" placeholder="Zip Code" class="border p-2 w-1/3 rounded" v-model="formData.zipCode">
            </div>
          </div>
          <div>
            <h3 class="font-semibold">Payment Method</h3>
            <select  v-model="formData.paymentMethod" class="border p-2 w-full rounded mt-2">
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
                <input type="text" placeholder="MM/YY" class="border p-2 w-1/2 rounded" v-model="formData.cardExpiry">
                <input type="text" placeholder="CVC" class="border p-2 w-1/2 rounded" v-model="formData.cardCVC">
              </div>
            </div>
          </div>
              <button type="button" @click="handlePlaceOrder" class="w-full bg-gray-800 text-white py-2 rounded">Place Order</button>            
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
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  
];

const orderStore = useOrderStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
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
  if (!authStore.userId) {
    alert("Please log in first!");
    return;


  // Basic form validation
  if (!formData.value.email) {
    alert("Please enter your email address");
    return;
  }
  
  if (!formData.value.phoneNumber) {
    alert("Please enter your phone number");
    return;
  }
  
  if (!formData.value.country || !formData.value.fullName || !formData.value.addressLine1 || !formData.value.city) {
    alert("Please fill in all required shipping address fields");
    return;
  }
  
  if (formData.value.paymentMethod === 'mobile_money' && !formData.value.mobileMoneyNumber) {
    alert("Please enter your Mobile Money Number");
    return;
  }

  if (formData.value.paymentMethod === 'bank_account' && 
     (!formData.value.nameOnCard || !formData.value.cardNumber || !formData.value.cardExpiry || !formData.value.cardCVC)) {
    alert("Please fill in all card details");
    return;
  }
  }

  try {
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
    };

    // Store the metadata in localStorage to access it later
    if (import.meta.client) {
      localStorage.setItem('lastOrderMetadata', JSON.stringify(orderMetadata));
    }
    
    // Call the existing placeOrder function with userId
    const order = await orderStore.placeOrder(authStore.userId);
    console.log("Order placed:", order);
    
    if (order) {
      alert(`Order placed successfully! Order ID: ${order.id}`);
      
      // Navigate to order confirmation page
      await nextTick();
      router.push(`/orders/${order.id}`);
   }
  }
    catch (error) {
    console.error("Order placement error:", error);
    alert(error.message || "Failed to place order");
  }
};
</script>
