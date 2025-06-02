<template>
  <div :class="{ dark: isDarkMode }" class="bg-white dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-900">
      <!-- <FlowbiteCarousel /> -->
      <ProductsList/>

      <!-- <FiltersC/> -->
    </div>
    <AllCategories/>
  </div>
</template>

<script setup>
import FlowbiteCarousel from '~/components/FlowbiteCarousel.vue';
import ProductsList from '~/components/ProductsList.vue';
import AllCategories from '~/components/product/AllCategoriesC.vue';


definePageMeta({
  layout:'default'
});

</script>
