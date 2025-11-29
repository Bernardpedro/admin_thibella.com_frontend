import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  
  function setQuery(searchQuery: string) {
    query.value = searchQuery
  }

  return { query, setQuery }
})
