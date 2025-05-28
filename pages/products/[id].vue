<script setup>
import { ref, onMounted, watch } from "vue";
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null); // Add this for tracking selected image
const isAddedToCart = ref(false); // Add this to track cart state

cartStore.loadCart();

onMounted(async () => {
  try {
    loading.value = true;
    const productId = route.params.id;

    // Validate UUID format (optional but recommended)
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    // Fetch single product directly from backend
    const response = await apiFetch(`api/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
    });

    // Your Spring controller returns the ProductDTO directly, not wrapped in a data property
    product.value = response;
    console.log("product from data loader",product.value);
  } catch (err) {
    console.error("Error fetching product:", err);
    if (err.status === 404) {
      error.value = "Product not found";
    } else {
      error.value = "Failed to load product details";
    }
  } finally {
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

// Track the permanently selected image (from clicks)
const permanentlySelectedImage = ref(null);

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
  if (product.value) {
    // Change button state
    isAddedToCart.value = true;
    
    // Show alert with product name
    alert(`${product.value.name} is added to cart`);
    
    // Add product to cart store
    cartStore.addToCart(product.value);
    
  }
};
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="container mx-auto p-4 text-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
    <p class="mt-4 text-gray-600">Loading product details...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container mx-auto p-4 text-center">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{{ error }}</p>
      <button 
        @click="$router.go(-1)" 
        class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Go Back
      </button>
    </div>
  </div>

  <!-- Product Details -->
  <div v-else-if="product" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Image Gallery (Top-Left) - Modified Layout -->
      <div class="self-start">
        <div class="flex gap-4 max-h-96">
          <!-- Main Product Image -->
          <div class="flex-1">
            <img 
              :src="selectedImage || product.image" 
              alt="Product" 
              class="w-full h-96 object-contain rounded-lg shadow-lg bg-gray-50 transition-all duration-300"
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
      <div>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-gray-500">{{ product.description }}</p>
        <div class="flex items-center mt-2">
          <span class="text-yellow-500">
            <!-- Add rating stars display here when available from API -->
            ⭐⭐⭐⭐⭐
          </span>
          <span class="ml-2 text-gray-600">(19 orders)</span>
        </div>
        <p class="text-3xl text-blue-600 font-bold my-4">
          {{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency) }}
        </p>

        <!-- Display Colors (Fixed: changed from product.color to product.colors) -->
        <div v-if="product.colors?.length">
          <p class="font-semibold">Available Colors:</p>
          <div class="flex space-x-2">
            <span
              v-for="color in product.colors"
              :key="color"
              class="px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
            <button v-if="color == 'blue'" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'red'" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'white'" class="bg-white-500 text-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'green'" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'yellow'" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors">
              {{ color }}
            </button>
            </span>
          </div>
        </div>

        <!-- Display Sizes (Fixed: changed from product.clothingSize?.length to check if it's not empty) -->
        <div v-if="product.clothingSize && product.clothingSize.trim() !== ''" class="mt-4">
          <p class="font-semibold">Available Size:</p>
          <div class="flex space-x-2 flex-wrap">
            <span
              class="px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
              {{ product.clothingSize }}
            </span>
          </div>
        </div>

        <!-- Display Shoe Sizes (if applicable) -->
        <div v-if="product.shoesSize && product.shoesSize > 0" class="mt-4">
          <p class="font-semibold">Shoe Size:</p>
          <div class="flex space-x-2 flex-wrap">
            <span
              class="px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
              {{ product.shoesSize }}
            </span>
          </div>
        </div>

        <!-- Buy Now Button with dynamic styling -->
        <button 
          @click="handleBuyNow"
          :class="isAddedToCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
          class="mt-6 text-white px-6 py-3 rounded-lg w-full transition-colors"
        >
          {{ isAddedToCart ? 'Added to Cart' : 'Buy Now' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="container mx-auto p-4 text-center">
    <p class="text-gray-500">Product not found</p>
    <button 
      @click="$router.go(-1)" 
      class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Go Back
    </button>
  </div>
</template>