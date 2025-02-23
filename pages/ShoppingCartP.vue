<template>
  <div>
    <ShoppingCartC/>
  </div>
</template>

<script setup lang="ts">
import ShoppingCartC from '~/components/cart/ShoppingCartC.vue';


definePageMeta({
layout:'headeronly',
});

</script>