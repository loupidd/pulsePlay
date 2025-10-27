<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

interface FilterItem {
  id: number
  name: string
  type: string
  image?: string
}

const props = defineProps<{
  isOpen: boolean
  items: FilterItem[]
  selectedFilters: number[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-item', item: FilterItem): void
}>()

const searchQuery = ref('')

// Debug logging
watch(
  () => props.items,
  (newItems) => {
    console.log('📋 FilterModal items updated:', newItems?.length || 0, 'total items')
  },
  { immediate: true },
)

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      console.log('🔓 Modal opened - Available items:', props.items?.length || 0)
    }
  },
)

const filteredItems = computed(() => {
  const items = props.items || []

  if (!searchQuery.value.trim()) {
    return items
  }

  const query = searchQuery.value.toLowerCase().trim()
  const filtered = items.filter((item) => item.name.toLowerCase().includes(query))

  console.log(`🔍 Search "${query}": ${filtered.length}/${items.length} results`)
  return filtered
})

const isSelected = (id: number) => props.selectedFilters?.includes(id)

// Group items by type for better display
const groupedItems = computed(() => {
  const competitions = filteredItems.value.filter((item) => item.type === 'competition')
  const clubs = filteredItems.value.filter((item) => item.type === 'club')

  return {
    competitions,
    clubs,
  }
})

// Reset search when modal closes
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      searchQuery.value = ''
    }
  },
)

const handleAddItem = (item: FilterItem) => {
  console.log('➕ Adding filter:', item.name, `(${item.type})`)
  emit('add-item', item)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      @click.self="emit('close')"
    >
      <div
        class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-700/50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h3 class="text-xl font-semibold text-white">Add Filter</h3>
          <button @click="emit('close')" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Search -->
        <div class="p-6 border-b border-gray-700/50">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search competitions and clubs..."
              class="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-colors"
              autofocus
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Items -->
        <div class="p-6 overflow-y-auto flex-1 scrollbar-custom">
          <!-- Loading State -->
          <div v-if="!items || items.length === 0" class="text-center py-12">
            <div
              class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-white/30 mb-4"
            ></div>
            <p class="text-white/60 text-sm">Loading competitions and clubs...</p>
          </div>

          <template v-else>
            <!-- Competitions Section -->
            <div v-if="groupedItems.competitions.length > 0" class="mb-8">
              <h4 class="text-sm font-semibold text-white/60 mb-4 px-2">
                Competitions ({{ groupedItems.competitions.length }})
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div
                  v-for="item in groupedItems.competitions"
                  :key="`competition-${item.id}`"
                  @click="handleAddItem(item)"
                  class="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border relative group"
                  :class="
                    isSelected(item.id)
                      ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/20'
                      : 'border-gray-700/50 hover:bg-white/8 hover:border-gray-600'
                  "
                >
                  <!-- Selected Checkmark -->
                  <div
                    v-if="isSelected(item.id)"
                    class="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-3 h-3 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div
                    v-if="item.image"
                    class="rounded-full bg-white flex-shrink-0 w-16 h-16"
                    :style="{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }"
                  />
                  <span
                    class="text-xs font-medium text-center text-white leading-tight line-clamp-2"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Clubs Section -->
            <div v-if="groupedItems.clubs.length > 0">
              <h4 class="text-sm font-semibold text-white/60 mb-4 px-2">
                Clubs ({{ groupedItems.clubs.length }})
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div
                  v-for="item in groupedItems.clubs"
                  :key="`club-${item.id}`"
                  @click="handleAddItem(item)"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border relative group"
                  :class="
                    isSelected(item.id)
                      ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/20'
                      : 'border-gray-700/50 hover:bg-white/8 hover:border-gray-600'
                  "
                >
                  <!-- Selected Checkmark -->
                  <div
                    v-if="isSelected(item.id)"
                    class="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-2.5 h-2.5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div
                    v-if="item.image"
                    class="rounded-full bg-white flex-shrink-0 w-12 h-12"
                    :style="{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: '70%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }"
                  />
                  <span
                    class="text-xs font-medium text-center text-white leading-tight line-clamp-2"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="filteredItems.length === 0 && searchQuery" class="text-center py-12">
              <svg
                class="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p class="text-gray-500 text-sm mb-2">No results found for "{{ searchQuery }}"</p>
              <button
                @click="searchQuery = ''"
                class="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-700/50 flex justify-between items-center gap-3">
          <div class="text-sm text-white/60">
            {{ selectedFilters.length }} filter{{ selectedFilters.length !== 1 ? 's' : '' }}
            selected
          </div>
          <div class="flex gap-3">
            <button
              @click="emit('close')"
              class="px-5 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              @click="emit('close')"
              class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8);
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.9);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
