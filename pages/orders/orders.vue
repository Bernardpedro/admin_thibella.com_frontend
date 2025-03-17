<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Left sidebar with product images -->
    <div class="w-48 bg-gray-50 border-r border-gray-200 p-4 flex flex-col items-center gap-6">
      <div v-for="(image, index) in productImages" :key="index" class="w-32 h-32 flex items-center justify-center">
        <img :src="image" :alt="`Product view ${index + 1}`" class="max-w-full max-h-full object-contain" />
      </div>
      
      <!-- Barcode at bottom -->
      <div class="mt-auto">
        <img src="assets/img/barcode.png" alt="Barcode" class="w-32" />
      </div>
    </div>
    
    <!-- Main content area -->
    <div class="flex-1 flex flex-col">
      <!-- Product header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center gap-2 mb-4">
          <button class="text-black">
            <span class="text-xl">←</span>
          </button>
          <h1 class="text-2xl font-bold tracking-tight">NIKE SB AIR MAX JANOSKI 2</h1>
        </div>
        
        <!-- Customer information section -->
        <div class="mb-8">
          <h2 class="font-medium mb-4">Customer information</h2>
          
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div class="text-sm text-gray-500 mb-1">Customer</div>
              <div>{{ customer.name }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">State</div>
              <div class="flex justify-between items-center">
                <span>{{ customer.state }}</span>
                <span>▼</span>
              </div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">City</div>
              <div>{{ customer.city }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Zip code</div>
              <div>{{ customer.zipCode }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Street</div>
              <div>{{ customer.street }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Number</div>
              <div>{{ customer.number }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Phone</div>
              <div>{{ customer.phone }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Email</div>
              <div>{{ customer.email }}</div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-4 gap-4">
          <!-- Each cell contains both label and value -->
          <div v-for="(item, index) in orderDetails" :key="index" class="border border-gray-100 p-2">
            <div class="text-sm text-gray-500">{{ item.label }}</div>
            <div class="flex justify-between items-center">
              <span>{{ item.value }}</span>
              <!-- <span v-if="item.hasDropdown">▼</span> -->
            </div>
          </div>
        </div>
        
        <!-- Return details section -->
        <div class="mb-8">
          <h2 class="font-medium mb-4">Return details</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500 mb-1">Return address</div>
              <div>{{ returns.address }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Phone</div>
              <div>{{ returns.phone }}</div>
            </div>
          </div>
        </div>
        
        <!-- Schedule courier section -->
        <div class="mb-8">
          <h2 class="font-medium mb-4">Schedule courier</h2>
          
          <div class="flex gap-4">
            <div v-for="(time, index) in courierTimes" :key="index" 
                 class="border border-gray-300 p-4 w-40 text-center"
                 :class="{ 'border-black': time.selected }">
              <div class="font-medium">{{ time.time }}</div>
              <div class="text-sm text-gray-500">{{ time.description }}</div>
            </div>
          </div>
          
          <div class="flex mt-4 items-center">
            <div class="w-4 h-1 bg-black"></div>
            <div class="w-1 h-1 bg-gray-300 rounded-full mx-1"></div>
            <div class="w-1 h-1 bg-gray-300 rounded-full mx-1"></div>
            <div class="w-1 h-1 bg-gray-300 rounded-full mx-1"></div>
          </div>
        </div>
        
        <!-- Fulfill order button -->
        <button class="w-full bg-black text-white py-4 uppercase font-medium">
          Fulfill Order
        </button>
      </div>
      
      <!-- Tracking map area -->
      <div class="flex-1 relative">
        <div class="absolute inset-0 bg-gray-200">
          <!-- Map will be here -->
          <div class="w-full h-full relative">
            <img src="assets/img/Accessories/apple-watch.png" alt="Map" class="w-full h-full object-cover" />
            
            <!-- Current location marker -->
            <div class="absolute" style="top: 40%; left: 30%;">
              <div class="w-3 h-3 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
        
        <!-- Order tracking info overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-white">
          <div class="border-b border-gray-200">
            <div class="flex justify-between items-center px-6 py-3">
              <div>Track order</div>
              <div>{{ trackingNumber }}</div>
              <div>Courier pick up</div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-1 bg-black"></div>
                <div class="w-2 h-1 bg-black"></div>
                <div class="w-2 h-1 bg-gray-300"></div>
              </div>
            </div>
          </div>
          
          <!-- Order status steps -->
          <div class="flex">
            <div class="flex-1 flex items-center justify-center py-2 bg-black text-white relative">
              <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              Placed order
            </div>
            <div class="flex-1 flex items-center justify-center py-2 bg-black text-white">
              <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              Packed
            </div>
            <div class="flex-1 flex items-center justify-center py-2 bg-black text-white">
              <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              Sent
            </div>
            <div class="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-500">
              Arrived
            </div>
          </div>
          
          <!-- Order history -->
          <div class="p-6">
            <h2 class="font-medium mb-4">Order history</h2>
            
            <div class="grid grid-cols-3 gap-6">
              <div v-for="(product, index) in orderHistory" :key="index" class="text-center">
                <img :src="product.image" :alt="product.name" class="w-full h-32 object-contain mb-2" />
                <div class="font-medium">{{ product.name }}</div>
                <div v-if="product.subtitle" class="text-sm text-gray-500">{{ product.subtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// order
 
const orderDetails = ref([
  { label: 'Quantity', value: '1 pcs', hasDropdown: false },
  { label: 'Size', value: '11', hasDropdown: true },
  { label: 'Price', value: '$140', hasDropdown: false },
  { label: 'Shipping', value: '$27', hasDropdown: false },
  { label: 'Discount', value: '20%', hasDropdown: false },
  { label: 'Total', value: '$119', hasDropdown: false },
]);


// Sample data 
const productImages = ref([
  'assets/img/Accessories/apple-watch.png',
  'assets/img/Accessories/apple-watch.png',
  'assets/img/Accessories/apple-watch.png',
  '/assets/img/Accessories/apple-watch.png',
  'assets/img/Accessories/apple-watch.png',
  'assets/img/Accessories/apple-watch.png',
]);

const customer = ref({
  name: 'Jannet Hue',
  state: 'New York',
  city: 'New York',
  zipCode: '11205',
  street: 'Kent Avenue',
  number: '69',
  phone: '347-501-1891',
  email: 'janethue@gmail.com'
});

const order = ref({
  quantity: '1 pcs',
  size: '11',
  price: '140',
  shipping: '27',
  discount: '20%',
  total: '119'
});

const returns = ref({
  address: '446 W Broadway, NY',
  phone: '580-352-7934'
});

const courierTimes = ref([
  { 
    time: '9:30 am', 
    description: 'Tue 24th',
    selected: true
  },
  { 
    time: '11 am', 
    description: 'Tue 24th',
    selected: false
  },
  { 
    time: '3 pm', 
    description: 'Tue 24th',
    selected: false
  }
]);

const trackingNumber = ref('33648');

const orderHistory = ref([
  {
    name: 'NIKE AIR MAX 270',
    image: 'assets/img/Accessories/apple-watch.png'
  },
  {
    name: 'NIKE AIR MAX 200',
    subtitle: '(2000 WORLD STAGE)',
    image: 'assets/img/Accessories/apple-watch.png'
  },
  {
    name: 'NIKE BLAZER CITY EASE',
    image: 'assets/img/Accessories/apple-watch.png'
  },
  {
    name: 'NIKE BLAZER LOW LX',
    image: 'assets/img/Accessories/apple-watch.png'
  },
  {
    name: 'NIKE AIR FORCE 1',
    subtitle: '\'07 DECONSTRUCTED',
    image: 'assets/img/Accessories/apple-watch.png'
  },
  {
    name: 'NIKE AIR JORDAN 10',
    subtitle: 'RETRO',
    image: 'assets/img/Accessories/apple-watch.png'
  },
]);
</script>