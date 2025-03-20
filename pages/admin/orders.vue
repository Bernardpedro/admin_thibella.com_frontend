<script setup>
import { ref } from 'vue';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const selectedOrderId = ref('');
const newStatus = ref('');

const updateStatus = () => {
  if (selectedOrderId.value && newStatus.value) {
    orderStore.updateOrderStatus(selectedOrderId.value, newStatus.value);
    alert('Order status updated!');
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold">Admin: Update Order Status</h1>

    <select v-model="selectedOrderId" class="border p-2 mt-4 w-full">
      <option value="" disabled>Select an Order</option>
      <option 
        v-for="order in orderStore.orders" 
        :key="order.id"
        :value="order.id"
      >
        {{ order.id }} ({{ order.status }})
      </option>
    </select>

    <select v-model="newStatus" class="border p-2 mt-4 w-full">
      <option value="" disabled>Select a New Status</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

    <button @click="updateStatus" class="bg-green-500 text-white p-2 mt-4">
      Update Status
    </button>
  </div>
</template>
