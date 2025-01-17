<template>
  <div class="relative w-full py-24">
    <!-- Carousel Background -->
    <div class="absolute inset-0 w-full h-full">
      <template v-for="(slide, index) in slides" :key="index">
        <div
          class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out bg-cover bg-center"
          :style="{ backgroundImage: `url(${slide.backgroundImage})`, opacity: currentSlide === index ? 1 : 0 }"
        >
          <div class="absolute inset-0 bg-black/30"></div>
        </div>
      </template>
    </div>

    <!-- New Arrivals Section -->
    <section class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="font-manrope font-bold text-4xl text-white mb-8 text-center">New Arrivals</h2>
      <div v-for="(slide, index) in slides" :key="index">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 transition-opacity duration-700 ease-in-out"
          :class="{ 'opacity-0 pointer-events-none': currentSlide !== index, 'opacity-100': currentSlide === index }"
        >
          <div
            v-for="product in slide.products"
            :key="product.id"
            class="relative bg-cover group rounded-3xl bg-center overflow-hidden mx-auto cursor-pointer"
          >
            <img class="rounded-2xl object-cover" :src="product.image" :alt="product.name" />
            <div
              class="absolute z-10 bottom-3 left-0 mx-3 p-3 bg-white w-[calc(100%-24px)] rounded-xl shadow-sm transition-all duration-500 group-hover:shadow-indigo-200 group-hover:bg-indigo-50"
            >
              <div class="flex items-center justify-between mb-2">
                <h6 class="font-semibold text-base leading-7 text-black">{{ product.name }}</h6>
                <h6 class="font-semibold text-base leading-7 text-indigo-600 text-right">${{ product.price }}</h6>
              </div>
              <p class="text-xs leading-5 text-gray-500">{{ product.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Buttons -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center z-10">
      <button
        type="button"
        class="flex justify-center items-center me-4 h-full cursor-pointer group focus:outline-none"
        @click="previousSlide"
      >
        <span class="text-white hover:text-gray-200 group-focus:text-gray-200 bg-black/50 p-2 rounded-full">
          <svg class="rtl:rotate-180 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
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
          <svg class="rtl:rotate-180 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
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
        name: 'Trendy Jacket',
        description: "Women's Winter Wear",
        price: 100,
        image: 'https://pagedone.io/asset/uploads/1700731972.png'
      },
      {
        id: 2,
        name: 'Black Blazer',
        description: 'Men’s Suits',
        price: 100,
        image: 'https://pagedone.io/asset/uploads/1700731993.png'
      },
      {
        id: 3,
        name: 'Red Flowers',
        description: 'Womenswear',
        price: 100,
        image: 'https://pagedone.io/asset/uploads/1700732011.png'
      },
      {
        id: 4,
        name: 'Denim Jacket',
        description: 'Children Wear',
        price: 100,
        image: 'https://pagedone.io/asset/uploads/1700732027.png'
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
