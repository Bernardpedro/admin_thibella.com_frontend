<template>
  <div class="js-myIndexPage">
    <div class="bg-white">
      <FilterComponent/>
      <FlowbiteCarousel/>
      <PromoSection />

      <div
        class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div
          class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <div class="group relative" v-for="i in 4" :key="i">
            <img
              src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
              alt="Front of men&#039;s Basic Tee in black."
              class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="text-sm text-gray-700">
                  <a href="#">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    Basic Tee
                  </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">Black</p>
              </div>
              <p class="text-sm font-medium text-gray-900">$35</p>
            </div>
          </div>

          <!-- More products... -->
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-1 lg:px-8">
        <div class="mx-auto max-w-9xl lg:mx-0">
          <div
            class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
          >
            <ul class="flex flex-wrap -mb-px">
              <li class="me-2">
                <span
                @click="
                  tab = tab === 1 ? 0 : 1;
                  isClickedKids = false
                  isClickedWomen = !isClickedWomen
                  isClickedMen = false
                  isClickedAccessories = false
                "
                :class="{
                  'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500':
                    isClickedWomen
                }"
                :aria-current="isClickedWomen ? 'page' : null"
              >
                <span
                  aria-current="page"
                  class="inline-block p-4 border-blue-600 rounded-t-lg active cursor-pointer"
                >
                Women
                </span>
              </span>
              </li>
              <li class="me-2 inline-block">
                <span
                @click="
                 tab = tab === 2 ? 0 : 2;
                  isClickedKids = false
                  isClickedWomen = false
                  isClickedMen = !isClickedMen
                  isClickedAccessories = false
                "
                :class="{
                  'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500':
                    isClickedMen
                }"
                :aria-current="isClickedMen ? 'page' : null"
              >
                <span
                  aria-current="page"
                  class="inline-block p-4 border-blue-600 rounded-t-lg active cursor-pointer"
                >
                Men
                </span>
              </span>
              </li>
              <li class="me-2">
                <span
                  @click="
                    tab = tab === 3 ? 0 : 3;
                    isClickedKids = !isClickedKids
                    isClickedWomen = false
                    isClickedMen = false
                    isClickedAccessories = false
                  "
                  :class="{
                    'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500':
                      isClickedKids
                  }"
                  :aria-current="isClickedKids ? 'page' : null"
                >
                  <span
                    aria-current="page"
                    class="inline-block p-4 border-blue-600 rounded-t-lg active cursor-pointer"
                  >
                    Kids 
                  </span>
                </span>
              </li>
              <span
                @click="
                  tab = tab === 4 ? 0 : 4;
                  isClickedKids = false
                  isClickedWomen = false
                  isClickedMen = false
                  isClickedAccessories = !isClickedAccessories
                "
                :class="{
                  'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500':
                    isClickedAccessories
                }"
                :aria-current="isClickedAccessories ? 'page' : null"
              >
                <span
                  aria-current="page"
                  class="inline-block p-4 border-blue-600 rounded-t-lg active cursor-pointer"
                >
                  Accessories
                </span>
              </span>

              <li>
                <a
                  class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
                  >Disabled</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="tab === 1">
    <Women />
  </div>
  <div v-if="tab === 2">
    <Men />
  </div>
  <div v-if="tab === 3">
    <Kids />
  </div>
  <div v-if="tab === 4">
    <ProductsAccessories />
  </div>
</template>
<script setup>
import PromoSection from '~/components/PromoSection.vue';

definePageMeta({
  layout: 'default'
})
</script>

<script>
export default {
  data () {
    return {
      tab: 0,
      isClickedMen: false,
      isClickedWomen: false,
      isClickedKids: false,
      isClickedAccessories: false
    }
  }
}
</script>
