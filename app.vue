<template>
   <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup>
import { onMounted } from 'vue';
// import { useCartStore } from '~/stores/cart';

// const cartStore = useCartStore();

onMounted(() => {
  // cartStore.loadCart();
});
</script>