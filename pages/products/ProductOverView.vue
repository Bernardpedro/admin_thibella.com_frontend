<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Image Gallery -->
      <div>
        <img :src="selectedImage" alt="Product" class="w-full rounded-lg shadow-lg" />
        <div class="flex mt-2 space-x-2">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="image"
            @click="selectedImage = image"
            class="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 hover:border-gray-500"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-gray-500">{{ product.description }}</p>
        <div class="flex items-center mt-2">
          <span class="text-yellow-500">★★★★★</span>
          <span class="ml-2 text-gray-600">(19 orders)</span>
        </div>
        <p class="text-3xl text-red-600 font-bold my-4">{{ product.price }} RWF</p>

        <!-- Color Selection -->
        <div>
          <p class="font-semibold">Color:</p>
          <div class="flex space-x-2">
            <button
              v-for="color in product.colors"
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
          <p class="font-semibold">Shoe Size (EUR):</p>
          <div class="flex space-x-2">
            <button
              v-for="size in product.sizes"
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
        <div class="mt-4 flex items-center space-x-4">
          <button @click="decreaseQuantity" class="px-3 py-2 border rounded-lg">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity" class="px-3 py-2 border rounded-lg">+</button>
        </div>

        <p class="mt-2 text-sm text-gray-500">Estimated arrival: 1st Apr - 4th Apr (Shipping from China)</p>

        <!-- Buy Now Button -->
        <button class="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg w-full hover:bg-orange-600">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const product = ref({
  name: "Berluti Designer Sneakers",
  description: "High-end quality designer men sneaker genuine top layer cow leather leisure sports shoes.",
  price: "225,420",
  images: [
    "assets/img/apple-watch.png",
    "assets/img/apple-watch.png",
    "assets/img/apple-watch.png",
    "assets/img/apple-watch.png"
  ],
  colors: ["Wine Red", "Black"],
  sizes: [38, 39, 40, 41, 42, 43, 44]
});

const selectedImage = ref(product.value.images[0]);
const selectedColor = ref(product.value.colors[0]);
const selectedSize = ref(product.value.sizes[0]);
const quantity = ref(1);

const increaseQuantity = () => { quantity.value++ };
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value-- };
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
