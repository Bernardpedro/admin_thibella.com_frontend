import { ref, computed } from 'vue'


export default function useSearch(items) {
  const query = ref('');

  const filteredItems = computed(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(query.value.toLowerCase())
    )
  })

  return { query, filteredItems }
}

