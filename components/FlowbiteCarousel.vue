<template>
  <div class="relative w-full h-screen">
    <!-- Background Carousel -->
    <div class="absolute inset-0 w-full h-full">
      <template v-for="(slide, index) in slides" :key="index">
        <div
          class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out bg-cover bg-center"
          :style="{ backgroundImage: `url(${slide.backgroundImage})`, opacity: currentSlide === index ? 1 : 0 }"
        >
          <!-- Overlay to ensure product visibility -->
          <div class="absolute inset-0 bg-black/30"></div>
        </div>
      </template>
    </div>

    <!-- Products Container -->
    <div class="relative h-full w-full">
      <template v-for="(slide, index) in slides" :key="index">
        <div
          class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
          :class="{ 'opacity-0 pointer-events-none': currentSlide !== index, 'opacity-100': currentSlide === index }"
        >
          <div class="container mx-auto px-4 h-full flex items-center">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <div
                v-for="product in slide.products"
                :key="product.id"
                class="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 transform transition-transform hover:scale-105"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
                <p class="text-gray-600 mb-4">{{ product.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-2xl font-bold">${{ product.price }}</span>
                  <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Navigation buttons -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center z-10">
      <button
        type="button"
        class="flex justify-center items-center me-4 h-full cursor-pointer group focus:outline-none"
        @click="previousSlide"
      >
        <span class="text-white hover:text-gray-200 group-focus:text-gray-200 bg-black/50 p-2 rounded-full">
          <svg class="rtl:rotate-180 w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        class="flex justify-center items-center h-full cursor-pointer group focus:outline-none"
        @click="nextSlide"
      >
        <span class="text-white hover:text-gray-200 group-focus:text-gray-200 bg-black/50 p-2 rounded-full">
          <svg class="rtl:rotate-180 w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    backgroundImage: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    products: [
      {
        id: 1,
        name: 'Product 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 99.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg'
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
        price: 149.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg'
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
        price: 199.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg'
      }
    ]
  },
  {
    backgroundImage: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
    products: [
      {
        id: 4,
        name: 'Product 4',
        description: 'Duis aute irure dolor in reprehenderit in voluptate.',
        price: 129.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg'
      },
      {
        id: 5,
        name: 'Product 5',
        description: 'Excepteur sint occaecat cupidatat non proident.',
        price: 179.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg'
      },
      {
        id: 6,
        name: 'Product 6',
        description: 'Sunt in culpa qui officia deserunt mollit anim id.',
        price: 159.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg'
      }
    ]
  }
]

const currentSlide = ref(0)
let intervalId = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// Auto-advance slides
onMounted(() => {
  intervalId = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>