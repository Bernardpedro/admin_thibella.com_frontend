<template>
  <div :class="{ dark: isDarkMode }">
    <div class="bg-white dark:bg-gray-900">
      <FilterComponent />
      <FlowbiteCarousel />
      <PromoSection />

      <div
        class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
          Customers also purchased
        </h2>

        <div
          class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <div class="group relative" v-for="i in 4" :key="i">
            <img
              src="https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg"
              alt="Front of men&#039;s Basic Tee in black."
              class="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="text-sm text-gray-700 dark:text-gray-300">
                  <a href="#">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    Basic Tee
                  </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Black
                </p>
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                $35
              </p>
            </div>
          </div>
        </div>
      </div>

      <AllCategories />

      <div class="mx-auto max-w-7xl px-1 lg:px-8">
        <div class="mx-auto max-w-9xl lg:mx-0">
          <div
            class="text-sm font-medium text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
          >
            <ul class="flex flex-wrap -mb-px">
              <li class="me-2">
                <span
                  @click="
                    tab = tab === 1 ? 0 : 1;
                    resetTab('Women');
                  "
                  :class="getTabClasses(isClickedWomen)"
                  :aria-current="isClickedWomen ? 'page' : null"
                >
                  Women
                </span>
              </li>
              <li class="me-2">
                <span
                  @click="
                    tab = tab === 2 ? 0 : 2;
                    resetTab('Men');
                  "
                  :class="getTabClasses(isClickedMen)"
                  :aria-current="isClickedMen ? 'page' : null"
                >
                  Men
                </span>
              </li>
              <li class="me-2">
                <span
                  @click="
                    tab = tab === 3 ? 0 : 3;
                    resetTab('Kids');
                  "
                  :class="getTabClasses(isClickedKids)"
                  :aria-current="isClickedKids ? 'page' : null"
                >
                  Kids
                </span>
              </li>
              <li class="me-2">
                <span
                  @click="
                    tab = tab === 4 ? 0 : 4;
                    resetTab('Accessories');
                  "
                  :class="getTabClasses(isClickedAccessories)"
                  :aria-current="isClickedAccessories ? 'page' : null"
                >
                  Accessories
                </span>
              </li>
            </ul>
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
  </div>
</template>

<script>
import PromoSection from '~/components/PromoSection.vue';
import FlowbiteCarousel from '~/components/FlowbiteCarousel.vue';
import FilterComponent from '~/components/FilterComponent.vue';
import AllCategories from '~/components/AllCategories.vue';

export default {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
    toggleDarkMode: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      tab: 0,
      isClickedMen: false,
      isClickedWomen: false,
      isClickedKids: false,
      isClickedAccessories: false,
    };
  },
  methods: {
    resetTab(tabName) {
      this.isClickedMen = tabName === 'Men';
      this.isClickedWomen = tabName === 'Women';
      this.isClickedKids = tabName === 'Kids';
      this.isClickedAccessories = tabName === 'Accessories';
    },
    getTabClasses(isClicked) {
      return {
        'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500':
          isClicked,
        'inline-block p-4 text-gray-400 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400':
          !isClicked,
      };
    },
  },
};
</script>
