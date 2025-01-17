<template>
  <div class="relative overflow-hidden py-6">
    <div
      class="flex gap-4 animate-slide-left-to-right whitespace-nowrap"
      style="animation-duration: 40s;"
    >
      <button
        type="button"
        class="group relative overflow-hidden rounded-full px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        ></span>
        <span class="relative z-10">
          <a href="/TestimonialPage">Testimony</a></span>
      </button>

      <button
        type="button"
        class="group relative overflow-hidden rounded-full px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        ></span>
        <span class="relative z-10"> 
          <a href="/ShopByCategory">
            Shop by category
        </a>
      </span>
      </button>

      <button
        type="button"
        class="group relative overflow-hidden rounded-full px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        ></span>
        <span class="relative z-10"><a href="/AvailableProductsPage">
          Available Products

        </a></span>
      </button>

      <button
        type="button"
        class="group relative overflow-hidden rounded-full px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        ></span>
        <span class="relative z-10"><a href="/PromoPage">
          Final Stock.
          Up to 50% off.
        </a></span>
      </button>

      <button
        type="button"
        class="group relative overflow-hidden rounded-full px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        ></span>
        <span class="relative z-10"><a href="/NewArrivalsPage">
          New Arrivals
        </a></span>
      </button>
    </div>
  </div>
</template>

<style>
/* Carousel animation for sliding left to right */
@keyframes slide-left-to-right {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-slide-left-to-right {
  display: inline-flex;
  animation: slide-left-to-right linear infinite;
}
</style>
