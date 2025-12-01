<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from 'vue-router';
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null);
const selectedColor = ref('');
const selectedSize = ref('');

// Track the permanently selected image (from clicks)
const permanentlySelectedImage = ref(null);

// Computed property to check if current product with selected options is already in cart
const isProductInCart = computed(() => {
  if (!product.value) return false;
  
  // color and size in the cart
  const currentOptions = {
    color: selectedColor.value,
    size: selectedSize.value,
  };
  
  // Check if item exists in cart using the cart store method
  return cartStore.isProductInCart(product.value.id, currentOptions);
});

// Computed property for button text
const buttonText = computed(() => {
  return isProductInCart.value ? 'Go to Cart' : 'Buy Now';
});

// use local state to select color 
const selectColor = (color) => {
  selectedColor.value = color;
};

// use local state to select clothing size
const selectSize = (size) => {
  selectedSize.value = size;
};

cartStore.loadCart();

onMounted(async () => {

    loading.value = true;
    const productId = route.params.id;

    // Try to load from API first
    try {
      const response = await apiFetch(`/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      });

      product.value = response;
      console.log("Product loaded from API:", product.value);

    } catch (err) {
      console.warn(err);
    }finally {
  loading.value = false; 
}
 
});

// Initialize selected image when product loads
watch(product, (newProduct) => {
  if (newProduct) {
    // Set initial image as the main product image
    selectedImage.value = newProduct.image;
    permanentlySelectedImage.value = newProduct.image; // Set as permanently selected
  }
});

// Function to handle image selection (click)
const selectImage = (image) => {
  selectedImage.value = image;
  permanentlySelectedImage.value = image; // Remember the clicked image
};

// Function to handle hover (for hover effect)
const hoverImage = (image) => {
  selectedImage.value = image;
};

// Function to reset to permanently selected image when hover ends
const resetImage = () => {
  if (permanentlySelectedImage.value) {
    selectedImage.value = permanentlySelectedImage.value;
  } else if (product.value) {
    selectedImage.value = product.value.image;
  }
};

// Function to handle buy now button click
const handleBuyNow = () => {
  if (!product.value) return;

  const currentOptions = {
    color: selectedColor.value,
    size: selectedSize.value,
  };

  // Check if product with these exact options is already in cart
  if (cartStore.isProductInCart(product.value.id, currentOptions)) {
    // Show confirmation dialog for adding duplicate item
    const userConfirmed = confirm(`Do you want to add ${product.value.name} again into your cart?`);
    
    if (userConfirmed) {
      // Add product to cart again
      cartStore.addToCart(product.value, currentOptions);
      
      const optionsText = [];
      if (selectedColor.value) optionsText.push(`Color: ${selectedColor.value}`);
      if (selectedSize.value) optionsText.push(`Size: ${selectedSize.value}`);

      alert(`${product.value.name}${optionsText.length ? ` (${optionsText.join(', ')})` : ''} is added to cart again`);
    }
  } else {
    // Add product to cart for the first time
    cartStore.addToCart(product.value, currentOptions);
    
    const optionsText = [];
    if (selectedColor.value) optionsText.push(`Color: ${selectedColor.value}`);
    if (selectedSize.value) optionsText.push(`Size: ${selectedSize.value}`);

    alert(`${product.value.name}${optionsText.length ? ` (${optionsText.join(', ')})` : ''} is added to cart`);
  }

  console.log("Product added to cart:", product.value);
  console.log("Selected options:", currentOptions);
};


const colorClasses = {
  blue: "bg-blue-500 hover:bg-blue-600 text-white",
  red: "bg-red-500 hover:bg-red-600 text-white",
  white: "bg-white text-black hover:bg-gray-200",
  green: "bg-green-500 hover:bg-green-600 text-white",
  yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
};

// default color if the color is not in the map
const defaultColorClass = "bg-gray-400 hover:bg-gray-500 text-white";




</script>

<template>
    <!-- Add dark mode background to the main wrapper -->
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">

  <!-- Loading State -->
  <div v-if="loading" class="container mx-auto p-4 text-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
    <p class="mt-4 text-gray-600 dark:text-gray-300">Loading product details...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container mx-auto p-4 text-center">
    <div class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow">
      <p class="font-medium">{{ error }}</p>
      <button 
        @click="$router.go(-1)" 
        class="mt-3 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200"
      >
        Go Back
      </button>
    </div>
  </div>

  <!-- Product Details -->
  <div v-else-if="product" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-800">
      <!-- Image Gallery (Top-Left) - Modified Layout -->
      <div class="self-start">
        <div class="flex gap-4 max-h-96">
          <!-- Main Product Image -->
          <div class="flex-1">
            <img 
              :src="selectedImage || product.image" 
              alt="Product" 
              class="w-full h-96 object-contain rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300"
            />
          </div>
          
          <!-- Thumbnail Images on the Right Side -->
          <div class="flex flex-col gap-2 w-20 overflow-y-auto">
            
            <!-- Additional product images thumbnails -->
            <img
              v-for="(image, index) in product.possibleImagesOfProduct"
              :key="index"
              :src="image"
              alt="Product variation"
              class="w-16 h-16 object-contain rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0"
              :class="selectedImage === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400'"
              @mouseenter="hoverImage(image)"
              @mouseleave="resetImage"
              @click="selectImage(image)"
            /> 
          </div>
        </div>
      </div>

      <!-- Product Details (Right) -->
      <div class="text-gray-900 dark:text-white">
        <h1 class="text-2xl font-bold dark:text-white">{{ product.name }}</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ product.description }}</p>
        <p class="text-3xl text-green-600 dark:text-green-400 font-bold my-4">
          {{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency) }}
        </p>

        <!-- loop in product.color and display buttons of Colors -->

        <div v-if="product.colors?.length">
        <p class="font-semibold">Available Colors:</p>

        <div class="flex space-x-2">
        <span
          v-for="color in product.colors"
          :key="color"
          @click="selectColor(color)"
        >
          <button
            class="px-3 py-1 rounded-lg text-sm transition-colors"
            :class="colorClasses[color] || defaultColorClass"
          >
            {{ color }}
          </button>
        </span>
        </div> 

        <!-- display selected color -->
        <div v-if="selectedColor" class="mt-2">
        <p class="font-semibold">
        Selected color:
        <span
          class="font-medium px-2 py-1 rounded"
          :class="colorClasses[selectedColor] || defaultColorClass"
        >
          {{ selectedColor }}
        </span>
        </p>
        </div>
        </div>

        <!-- loop in product.size and Display Sizes-->
        <div v-if="product.size && product.size.length > 0" class="mt-4">
          <p class="font-semibold">Available Sizes:</p>
          <div class="flex space-x-2 flex-wrap">
            <button>
              <span class="px-3 py-1 m-1 bg-gray-400 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100" v-for="size in product.size" 
              :key="size"
              @click="selectSize(size)">
                {{ size }}
              </span>
            </button>
          </div>
        </div>

         <!-- Display selected size of clothing -->
           <div v-if="selectedSize" class="mt-2">
              <p class="font-semibold">
                Selected size: <span 
                class="' text-black-500 w-24 px-2 py-1 rounded hover:bg-black-600 font-medium '"
              >
              {{ selectedSize }}
            </span>
              </p>
           </div>

        <!-- Buy Now Button with dynamic styling -->
         <span class="flex flex-row gap-4">
           <button 
           @click="handleBuyNow"
           :class="isProductInCart ? 'bg-green-500 dark:bg-green-400 hover:bg-green-600' : 'bg-green-500 dark:bg-green-400 hover:bg-green-600'"
           class="mt-6 text-white px-6 py-3 rounded-lg w-48 transition-colors"
           >
           {{ buttonText }}
          </button>
      </span>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="container mx-auto p-4 text-center">
    <p class="text-gray-500 dark:text-gray-300">Product not found</p>
    <button 
      @click="$router.go(-1)" 
      class="mt-2 bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Go Back
    </button>
  </div>
  </div>
</template>