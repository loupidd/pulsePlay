import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchQuery = ref('')

  // Getters
  const hasActiveSearch = computed(() => searchQuery.value.trim().length > 0)

  const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

  // Actions
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearSearch() {
    searchQuery.value = ''
  }

  function matchesSearch(clubName: string): boolean {
    if (!hasActiveSearch.value) return true

    return clubName.toLowerCase().includes(normalizedQuery.value)
  }

  return {
    searchQuery,
    hasActiveSearch,
    normalizedQuery,
    setSearchQuery,
    clearSearch,
    matchesSearch,
  }
})
