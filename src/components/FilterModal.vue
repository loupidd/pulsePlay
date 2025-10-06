<script setup lang="ts">
import { ref, computed } from 'vue'
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

const filteredItems = computed(() =>
  (props.items || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

const isSelected = (id: number) => props.selectedFilters?.includes(id)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-700/50"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h3 class="text-xl font-semibold text-white">Add Filter</h3>
            <button @click="emit('close')" class="p-2 hover:bg-white/10 rounded-lg">
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
                class="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20"
              />
            </div>
          </div>

          <!-- Items -->
          <div class="p-6 overflow-y-auto flex-1 scrollbar-custom">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="item in filteredItems"
                :key="`${item.type}-${item.id}`"
                @click="emit('add-item', item)"
                class="flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border relative"
                :class="
                  isSelected(item.id)
                    ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/20'
                    : 'border-gray-700/50 hover:bg-white/8 hover:border-gray-600'
                "
              >
                <div
                  class="rounded-full bg-white flex-shrink-0"
                  :class="item.type === 'competition' ? 'w-14 h-14' : 'w-12 h-12'"
                  :style="{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: item.type === 'competition' ? 'contain' : '70%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }"
                />
                <span class="text-xs font-medium text-center text-white leading-tight">
                  {{ item.name }}
                </span>
              </div>
            </div>
            <div v-if="filteredItems.length === 0" class="text-center py-12">
              <p class="text-gray-500">No results found for "{{ searchQuery }}"</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-gray-700/50 flex justify-end gap-3">
            <button @click="emit('close')" class="px-5 py-2.5 bg-gray-700/50 text-white rounded-lg">
              Cancel
            </button>
            <button @click="emit('close')" class="px-5 py-2.5 bg-red-600 text-white rounded-lg">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
