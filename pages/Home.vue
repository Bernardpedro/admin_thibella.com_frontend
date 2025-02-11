<template>
  <div :class="{ dark: isDarkMode }" class="bg-white dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-900">
      <!-- <FilterComponent /> -->
      <FlowbiteCarousel />
      <ProductsList/>

      <!-- products filter -->
      <FiltersC/>
    </div>
    <AllCategories/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FlowbiteCarousel from '~/components/FlowbiteCarousel.vue';
import ProductsList from '~/components/ProductsList.vue';
import AllCategories from '~/components/product/AllCategoriesC.vue';
import FiltersC from '~/components/Filter/FiltersC.vue';


definePageMeta({
  layout:'default'
});

// Props
defineProps({
  isDarkMode: {
    type: Boolean,
    required: true,
  },
  toggleDarkMode: {
    type: Function,
    required: true,
  },
});

// State
const tab = ref(0);
const isClickedMen = ref(false);
const isClickedWomen = ref(false);
const isClickedKids = ref(false);
const isClickedAccessories = ref(false);

// Methods
const handleTabClick = (tabNumber, tabName) => {
  tab.value = tab.value === tabNumber ? 0 : tabNumber;
  
  if (tab.value !== 0) {
    resetTab(tabName);
  } else {
    resetTab('');
  }
};

const resetTab = (tabName) => {
  isClickedMen.value = tabName === 'Men';
  isClickedWomen.value = tabName === 'Women';
  isClickedKids.value = tabName === 'Kids';
  isClickedAccessories.value = tabName === 'Accessories';
};

const getTabClasses = (isClicked) => {
  return {
    'inline-block p-4 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 cursor-pointer': isClicked,
    'inline-block p-4 text-gray-400 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400 cursor-pointer': !isClicked,
  };
};
</script>
