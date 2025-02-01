<template>
  <div :class="{ dark: isDarkMode }" class="bg-white dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-900">
      <!-- <FilterComponent /> -->
      <FlowbiteCarousel />
      <ProductsList/>

      <!-- products filter -->
      <div class="mx-auto max-w-7xl px-1 lg:px-8">
        <div class="mx-auto max-w-9xl lg:mx-0">
          <div
            class="text-sm font-medium text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
          >
            <ul class="flex flex-wrap -mb-px">
              <li class="me-2">
                <button
                  @click="handleTabClick(1, 'Women')"
                  :class="getTabClasses(isClickedWomen)"
                  :aria-current="isClickedWomen ? 'page' : null"
                >
                  Women
                </button>
              </li>
              <li class="me-2">
                <button
                  @click="handleTabClick(2, 'Men')"
                  :class="getTabClasses(isClickedMen)"
                  :aria-current="isClickedMen ? 'page' : null"
                >
                  Men
                </button>
              </li>
              <li class="me-2">
                <button
                  @click="handleTabClick(3, 'Kids')"
                  :class="getTabClasses(isClickedKids)"
                  :aria-current="isClickedKids ? 'page' : null"
                >
                  Kids
                </button>
              </li>
              <li class="me-2">
                <button
                  @click="handleTabClick(4, 'Accessories')"
                  :class="getTabClasses(isClickedAccessories)"
                  :aria-current="isClickedAccessories ? 'page' : null"
                >
                  Accessories
                </button>
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
    <AllCategories/>
  </div>
</template>

<script>
import FlowbiteCarousel from '~/components/FlowbiteCarousel.vue';
import FilterComponent from '~/components/FilterComponent.vue';
import ProductsList from '~/components/ProductsList.vue';
import Women from '~/components/Women.vue';
import Men from '~/components/Men.vue';
import Kids from '~/components/Kids.vue';
import ProductsAccessories from '~/components/ProductsAccessories.vue';
import AllCategories from '~/components/AllCategories.vue';



export default {
  name: 'TabComponent',
  components: {
    FlowbiteCarousel,
    FilterComponent,
    ProductsList,
    Women,
    Men,
    Kids,
    ProductsAccessories,
    AllCategories
  },
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
    handleTabClick(tabNumber, tabName) {
      // Set the tab number
      this.tab = this.tab === tabNumber ? 0 : tabNumber;
      
      // Reset the tabs if we're activating a tab
      if (this.tab !== 0) {
        this.resetTab(tabName);
      } else {
        // If we're deactivating a tab, reset all tabs to false
        this.resetTab('');
      }
    },
    resetTab(tabName) {
      this.isClickedMen = tabName === 'Men';
      this.isClickedWomen = tabName === 'Women';
      this.isClickedKids = tabName === 'Kids';
      this.isClickedAccessories = tabName === 'Accessories';
    },
    getTabClasses(isClicked) {
      return {
        'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 cursor-pointer':
          isClicked,
        'inline-block p-4 text-gray-400 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400 cursor-pointer':
          !isClicked,
      };
    },
  },
};
</script>