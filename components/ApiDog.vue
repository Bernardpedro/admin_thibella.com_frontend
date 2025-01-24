<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchUsers } from './api'

const users = ref([])

onMounted(async () => {
  try {
    users.value = await fetchUsers()
  } catch (error) {
    console.error('Failed to fetch users', error)
  }
})
</script>