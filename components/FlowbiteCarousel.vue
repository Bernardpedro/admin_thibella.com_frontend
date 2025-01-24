<template> 
  <div class="relative w-full h-screen">
    <!-- Static Background -->
    <div class="absolute inset-0 w-full h-full bg-cover bg-center">
      <img class="" src="assets/img/IRA_ecommerce_concept_resized.png" alt="e_commerce_Marketing">
      <!-- Overlay to ensure product visibility -->
      <div class="absolute inset-0 bg-black/30"></div>
    </div>

    <!-- Products Container -->
    <div class="relative h-full w-full overflow-hidden">
      <template v-for="(slide, index) in slides" :key="index">
        <div
          class="absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out"
          :style="{ transform: `translateX(${(index - currentSlide) * 100}%)` }"
        >
          <div class="container mx-auto px-4 h-full flex items-center">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <div
                v-for="product in slide.products"
                :key="product.id"
                class="bg-white dark:bg-gray-800 text-black dark:text-white backdrop-blur-sm rounded-lg shadow-xl p-6 transform transition-transform hover:scale-105"
              >
                <a href="/ProductsOverviewPage" class="block">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-48 object-cover rounded-lg mb-4"
                  />
                </a>
                <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ product.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-2xl font-bold">${{ product.price }}</span>
                  <button class="bg-yellow-300 dark:bg-yellow-300 text-black px-4 py-2 rounded-lg hover:bg-yellow-700 focus:ring-yellow-200 dark:hover:bg-yellow-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Static slides with products
const slides = [
  {
    products: [
      {
        id: 1,
        name: 'Product 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 99.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
        price: 149.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
        price: 199.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
      },
    ],
  },
  {
    products: [
      {
        id: 4,
        name: 'Product 4',
        description: 'Duis aute irure dolor in reprehenderit in voluptate.',
        price: 129.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
      },
      {
        id: 5,
        name: 'Product 5',
        description: 'Excepteur sint occaecat cupidatat non proident.',
        price: 179.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
      },
      {
        id: 6,
        name: 'Product 6',
        description: 'Sunt in culpa qui officia deserunt mollit anim id.',
        price: 159.99,
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
      },
    ],
  },
];

const currentSlide = ref(0);
let autoSlideInterval = null;

// Move to the next slide or reset after showing the background
const nextSlide = () => {
  if (currentSlide.value === slides.length) {
    // Pause on background for 3 seconds
    clearInterval(autoSlideInterval);
    setTimeout(() => {
      currentSlide.value = 0;
      startAutoSlide();
    }, 3000);
  } else {
    currentSlide.value++;
  }
};

// Start auto-slide motion
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 3000); // Adjust duration if needed
};

// Stop auto-slide when component is unmounted
const stopAutoSlide = () => {
  clearInterval(autoSlideInterval);
};

// Mount and unmount lifecycle hooks
onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>
