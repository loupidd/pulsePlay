<template>
  <div
    class="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 !h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-1">
      <h2 class="text-base sm:text-lg font-semibold text-white">Clubs & Competitions</h2>
      <button
        v-if="store.selectedFilters.length > 0"
        @click="clearAllFilters"
        class="text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
      >
        Clear All
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center py-12 gap-3">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <p class="text-sm text-white/60">Loading competitions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="flex flex-col items-center justify-center py-12 gap-3 px-4">
      <svg class="w-12 h-12 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-sm text-white/60 text-center">{{ store.error }}</p>
      <button
        @click="store.fetchLeaguesAndTeams()"
        class="text-xs text-white/80 hover:text-white px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Active Filters -->
      <div v-if="store.selectedFilters.length > 0" class="flex flex-col gap-2 mb-6">
        <span class="text-xs text-white/60 px-1"
          >Active Filters ({{ store.selectedFilters.length }})</span
        >
        <div class="flex flex-wrap gap-2">
          <div
            v-for="filter in store.selectedFilters"
            :key="'active-' + filter.id"
            class="active-filter-chip"
          >
            <div class="chip-icon" :style="{ backgroundImage: `url(${filter.image})` }"></div>
            <span class="chip-text">{{ filter.name }}</span>
            <button @click="removeFilter(filter.id)" class="chip-remove">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 sm:gap-8">
        <!-- Favorite Competitions Section -->
        <div v-if="favoriteCompetitions.length > 0">
          <div class="flex items-center gap-2 mb-3 sm:mb-4 px-1">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <span class="text-sm font-medium text-white/80">Favorites</span>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div
              v-for="comp in favoriteCompetitions"
              :key="'fav-' + comp.id"
              @click="toggleFilter(comp.id)"
              class="filter-item flex items-center gap-2.5 sm:gap-3 px-3 py-3 sm:py-3.5 rounded-xl cursor-pointer transition-all touch-manipulation"
              :class="{ 'filter-active': isSelected(comp.id) }"
            >
              <div
                class="bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
                :style="{
                  backgroundImage: `url(${comp.image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }"
              ></div>
              <span class="text-sm font-medium truncate flex-1">{{ comp.name }}</span>
              <button @click.stop="toggleFavorite(comp.id)" class="favorite-btn flex-shrink-0">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Only show competitions that are selected -->
        <div v-for="competition in selectedCompetitions" :key="competition.id">
          <!-- Competition -->
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <div
              @click="toggleFilter(competition.id)"
              class="filter-item flex items-center gap-2.5 sm:gap-3 px-3 py-3 sm:py-3.5 rounded-xl cursor-pointer transition-all flex-1 touch-manipulation"
              :class="{ 'filter-active': isSelected(competition.id) }"
            >
              <div
                class="bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
                :style="{
                  backgroundImage: `url(${competition.image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }"
              ></div>
              <span class="text-sm font-medium truncate">{{ competition.name }}</span>
            </div>
            <button
              @click="toggleFavorite(competition.id)"
              class="favorite-btn flex-shrink-0"
              :class="{ 'favorite-active': isFavorite(competition.id) }"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                :fill="isFavorite(competition.id) ? 'currentColor' : 'none'"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>

          <!-- Clubs -->
          <div class="ml-6 sm:ml-8 mt-3 sm:mt-4 space-y-2 sm:space-y-3 pl-0">
            <div
              v-for="club in competition.clubs"
              :key="club.id"
              @click="toggleFilter(club.id)"
              class="filter-item flex items-center gap-2 sm:gap-2.5 px-3 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-all touch-manipulation"
              :class="{ 'filter-active': isSelected(club.id) }"
            >
              <div
                class="rounded-full w-6 h-6 bg-white flex-shrink-0"
                :style="{
                  backgroundImage: `url(${club.image})`,
                  backgroundSize: '70%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }"
              ></div>
              <span class="text-xs sm:text-sm font-medium truncate">{{ club.name }}</span>
            </div>
          </div>
        </div>

        <!-- Add Filter Button -->
        <div
          class="filter-item flex items-center gap-2.5 sm:gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border border-color justify-center touch-manipulation"
          @click="showModal = true"
        >
          <div
            class="rounded-full w-7 h-7 bg-add-club relative flex justify-center items-center flex-shrink-0"
          >
            <div class="absolute w-0.5 h-3.5 bg-plus"></div>
            <div class="absolute h-0.5 w-3.5 bg-plus"></div>
          </div>
          <span class="text-sm font-medium truncate">Add Filter</span>
        </div>
      </div>
    </template>

    <!-- Filter Modal -->
    <FilterModal
      :isOpen="showModal"
      :items="availableItems"
      :selectedFilters="store.selectedFilters.map((f) => f.id)"
      @close="showModal = false"
      @add-item="onAddItem"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FilterModal from '../components/FilterModal.vue'
import { useFilterStore, type FilterItem } from '@/stores/useFilterStore'

interface Competition {
  id: number
  name: string
  image: string
  country: string
  clubs: Club[]
}
interface Club {
  id: number
  name: string
  image: string
  country: string
}

export default defineComponent({
  name: 'ClubCompetitions',
  components: { FilterModal },
  data() {
    return {
      showModal: false,
    }
  },
  setup() {
    const store = useFilterStore()
    return { store }
  },
  computed: {
    allItems(): FilterItem[] {
      const competitions = this.store.competitions.map((comp) => ({
        id: comp.id,
        name: comp.name,
        image: comp.image,
        type: 'competition' as const,
      }))
      const clubs = this.store.competitions.flatMap((comp) =>
        comp.clubs.map((club) => ({
          id: club.id,
          name: club.name,
          image: club.image,
          type: 'club' as const,
        })),
      )
      return [...competitions, ...clubs]
    },
    availableItems(): FilterItem[] {
      return this.allItems.filter(
        (item) => !this.store.selectedFilters.some((f) => f.id === item.id),
      )
    },
    favoriteCompetitions(): Competition[] {
      return this.store.competitions.filter((comp) => this.store.favorites.includes(comp.id))
    },
    // Only show competitions that have been selected as filters
    selectedCompetitions(): Competition[] {
      return this.store.competitions.filter((comp) =>
        this.store.selectedFilters.some((f) => f.id === comp.id && f.type === 'competition'),
      )
    },
  },
  mounted() {
    this.store.loadFavoritesFromStorage()
  },
  methods: {
    toggleFilter(id: number) {
      const item = this.getItemById(id)
      if (!item) return
      if (this.store.selectedFilters.some((f) => f.id === id)) {
        this.store.removeFilter(id)
      } else {
        this.store.addFilter(item)
      }
    },
    removeFilter(id: number) {
      this.store.removeFilter(id)
    },
    clearAllFilters() {
      this.store.clearFilters()
    },
    isSelected(id: number) {
      return this.store.selectedFilters.some((f) => f.id === id)
    },
    onAddItem(item: { id: number; name: string; image?: string; type: string }) {
      // Only add if image exists and type is valid
      if (item.image && (item.type === 'club' || item.type === 'competition')) {
        this.store.addFilter({
          id: item.id,
          name: item.name,
          image: item.image,
          type: item.type,
        })
      }
    },
    toggleFavorite(id: number) {
      this.store.toggleFavorite(id)
    },
    isFavorite(id: number) {
      return this.store.favorites.includes(id)
    },
    getItemById(id: number) {
      return this.allItems.find((item) => item.id === id)
    },
  },
  watch: {
    showModal(newVal) {
      // Fetch competitions when modal opens (first time only)
      if (newVal && this.store.competitions.length === 0) {
        this.store.fetchLeaguesAndTeams()
      }
    },
  },
})
</script>

<style scoped>
.filter-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.filter-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-active {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.active-filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
}

.chip-icon {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: white;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.chip-text {
  font-weight: 500;
}

.chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.chip-remove:hover {
  background: rgba(255, 255, 255, 0.1);
}

.favorite-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.4);
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(251, 191, 36, 0.8);
}

.favorite-active {
  color: rgb(251, 191, 36);
}

.border-color {
  border-color: rgba(255, 255, 255, 0.1);
}

.bg-add-club {
  background: rgba(255, 255, 255, 0.1);
}

.bg-plus {
  background: rgba(255, 255, 255, 0.6);
}

.filter-item {
  margin-bottom: 0;
  min-height: 44px; /* Minimum touch target size */
}

.filter-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}

.filter-item:active {
  transform: scale(0.98);
}

.filter-active {
  background-color: var(--c-crimson-500);
}

.filter-active:hover {
  background-color: var(--c-crimson-600);
}

.bg-add-club {
  background-color: var(--color-background-mute);
}

.bg-plus {
  background-color: var(--color-heading);
}

.border-color {
  border-color: rgba(107, 114, 128, 0.3);
}

/* Active Filter Chips */
.active-filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--c-crimson-500);
  border-radius: 12px;
  transition: all 0.2s;
  min-height: 36px;
}

.active-filter-chip:hover {
  background-color: var(--c-crimson-600);
}

.chip-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.chip-text {
  font-size: 12px;
  font-weight: 500;
  color: white;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .chip-text {
    max-width: 120px;
    font-size: 11px;
  }

  .chip-icon {
    width: 16px;
    height: 16px;
  }

  .active-filter-chip {
    padding: 6px 10px;
    min-height: 32px;
  }
}

.chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 4px;
  border-radius: 4px;
  min-width: 24px;
  min-height: 24px;
}

.chip-remove:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.2);
}

/* Favorite Button */
.favorite-btn {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.4);
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.favorite-active {
  color: #fbbf24;
}

.favorite-active:hover {
  color: #f59e0b;
}

/* Touch-friendly interactions */
@media (hover: none) and (pointer: coarse) {
  .filter-item:hover {
    transform: none;
  }

  .filter-item:active {
    transform: scale(0.97);
    background-color: rgba(255, 255, 255, 0.12);
  }

  .favorite-btn:hover {
    background-color: transparent;
  }

  .favorite-btn:active {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

/* Scrollbar styling - hide on mobile, show on desktop */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* Hide scrollbar on mobile */
@media (max-width: 640px) {
  .overflow-y-auto::-webkit-scrollbar {
    width: 0px;
  }
}

/* Smooth momentum scrolling on iOS */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection on touch devices */
@media (hover: none) and (pointer: coarse) {
  .filter-item,
  .favorite-btn,
  .chip-remove {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
</style>
