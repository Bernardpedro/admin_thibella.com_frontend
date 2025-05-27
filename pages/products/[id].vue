<script setup>
import { ref, onMounted, watch } from "vue";
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

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
    // Set initial image
    if (newProduct.imageOfColors?.length > 0) {
      cartStore.setSelectedImage(newProduct.imageOfColors[0]);
    }
  }
});
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
      <!-- Image Gallery (Top-Left) -->
      <div class="self-start">
        <img 
          :src="product.image" 
          alt="Product" 
          class="w-full rounded-lg shadow-lg"
        />
        <div class="flex mt-2 space-x-2">
          <!-- <img
            v-for="(image, index) in product.imageOfColors"
            :key="index"
            :src="image"
            class="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 hover:border-gray-500"
            :class="{ 'border-blue-500': cartStore.selectedImage === image }"
          /> -->
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

        <!-- Buy Now Button -->
        <button class="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition-colors">
          Buy Now 
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