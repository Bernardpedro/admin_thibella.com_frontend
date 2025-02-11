<template>
  <div :class="{ dark: isDarkMode }" class="bg-white dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-900">
      
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
      <WomenC/>      
    </div>
    <div v-if="tab === 2">
      <MenC/>
    </div>
    <div v-if="tab === 3">
      <KidsC/>
    </div>
    <div v-if="tab === 4">
      <AccessoriesC/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WomenC from './WomenC.vue';
import MenC from './MenC.vue';
import KidsC from './KidsC.vue';
import AccessoriesC from './AccessoriesC.vue';


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
