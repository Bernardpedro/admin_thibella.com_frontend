<script setup>
import { useProducts } from "@/composables/useProducts";

const { data: products, pending, error } = useProducts();
</script>

<template>
  <div>
    <h1>Products</h1>
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <ul v-else>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>
  </div>
</template>
