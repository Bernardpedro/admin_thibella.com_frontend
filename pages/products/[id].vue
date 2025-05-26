<script setup>
import { ref, onMounted } from "vue";
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const route = useRoute();
const allProducts = ref([]);
const product = ref(null);

cartStore.loadCart();

onMounted(async () => {
  try {
    const productId = route.params.id;

    // Check if products exist in localStorage
    const cachedProducts = localStorage.getItem("products");
    console.log("Cached products:", cachedProducts);

    if (cachedProducts) {
      allProducts.value = JSON.parse(cachedProducts);
    } else {
      const response = await apiFetch("api/products", {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          "Accept-Language": "en",
        },
      });

      allProducts.value = response.data || [];

      // Save data to localStorage
     // localStorage.setItem("products", JSON.stringify(allProducts.value));
    }

    // Find the product by ID
    product.value = allProducts.value.find(p => String(p.id) === String(productId));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Function to clear local storage and refresh data
const clearCacheAndReload = () => {
  localStorage.removeItem("products");
  location.reload();
};

// stars
 const ratingStars = product.value
</script>

<template>
  <div v-if="product" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Image Gallery (Top-Left) -->
      <div class="self-start">
        <img 
          :src="cartStore.selectedImage" 
          alt="Product" 
          class="w-full rounded-lg shadow-lg"
        />
        <div class="flex mt-2 space-x-2">
          <img
            v-for="(image, index) in product.imageOfColors"
            :key="index"
            :src="image"
            @click="cartStore.setSelectedImage(image)"
            class="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 hover:border-gray-500"
          />
        </div>
      </div>

      <!-- Product Details (Right) -->
      <div>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-gray-500">{{ product.description }}</p>
        <div class="flex items-center mt-2">
          <span class="text-yellow-500">
            <!-- <img :src= "" alt =""> il faut ajouter rating stars from api dog -->
          </span>
          <span class="ml-2 text-gray-600">(19 orders)</span>
        </div>
        <p class="text-3xl text-blue-600 font-bold my-4">{{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency)}} </p>

        <!-- Color Selection -->
        <div>
          <p class="font-semibold">Color:</p>
          <div class="flex space-x-2">
            <button
              v-for="color in product.color"
              :key="color"
              @click="selectedColor = color"
              class="px-4 py-2 border rounded-lg"
              :class="{ 'border-black': selectedColor === color }"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Size Selection -->
        <div class="mt-4">
          <p class="font-semibold">Shoe Size:</p>
          <div class="flex space-x-2">
            <button
              v-for="size in product.clothingSize"
              :key="size"
              @click="selectedSize = size"
              class="px-4 py-2 border rounded-lg"
              :class="{ 'border-black': selectedSize === size }"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Quantity Selector -->
        <!-- <div class="mt-4 flex items-center space-x-4">
          <button @click="decreaseQuantity" class="px-3 py-2 border rounded-lg">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity" class="px-3 py-2 border rounded-lg">+</button>
        </div> -->

        <!-- <p class="mt-2 text-sm text-gray-500">
          Estimated arrival: 1st Apr - 4th Apr (Shipping from China)
        </p> -->

        <!-- Buy Now Button -->
        <button class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg w-full hover:bg-blur-600">
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<!-- 
 <template>
  <div>
    <button @click="$router.push('/index')" class="text-blue-500">
      ← Back to Products
    </button>
    <button @click="clearCacheAndReload" class="ml-4 bg-red-500 text-white px-3 py-1 rounded">
      Refresh Data
    </button>

    <div v-if="product" class="mt-4 p-4 border rounded-lg shadow-md">
      <h1 class="text-xl font-bold">{{ product.name }}</h1>
      <p class="text-lg">Price: ${{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency) }}</p>
      <p>Description: {{ product.description }}</p>
      <img :src="product.imageOfColors.imageA" alt="Product" class="w-32 h-32 rounded-lg shadow-lg" />
    </div>
    <p v-else class="text-gray-500">Loading product...</p>

  //   Debug section 
    <div class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 class="font-bold">Debug Info:</h2>
      <p>Route ID: {{ $route.params.id }}</p>
      <p>Products count: {{ allProducts ? allProducts.length : 0 }}</p>
      <div v-if="allProducts && allProducts.length">
        <div v-for="p in allProducts" :key="p.id" class="mb-2 p-2 border">
          ID: {{ p.id }} ({{ typeof p.id }}) | Name: {{ p.name }}
        </div>
      </div>
    </div>
  </div>
</template>  -->
