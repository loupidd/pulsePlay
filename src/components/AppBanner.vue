<template>
  <div class="relative overflow-hidden rounded-2xl shadow-lg h-full">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div
        class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(220,38,38,0.3),transparent)]"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative h-full flex flex-col justify-between p-8">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <div class="text-red-500 text-sm font-semibold mb-1 uppercase tracking-wide">
            {{ matchData.competition }}
          </div>
          <h2 class="text-white text-2xl font-bold">
            {{ matchData.matchWeek }}
          </h2>
          <p class="text-gray-400 text-sm mt-1">{{ matchData.date }}</p>
        </div>

        <!-- Match Status Badge -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass">
            {{ matchData.status || 'Full Time' }}
          </span>
          <button @click="handleMenuClick" class="text-white hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Score Section -->
      <div class="flex items-center justify-center gap-8 my-auto">
        <!-- Home Team -->
        <div class="flex flex-col items-center gap-3">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              :src="matchData.homeTeam.logo"
              :alt="matchData.homeTeam.name"
              class="w-16 h-16 object-contain"
            />
          </div>
          <span class="text-white font-semibold text-lg">{{ matchData.homeTeam.name }}</span>
        </div>

        <!-- Score -->
        <div class="flex items-center gap-4">
          <div class="text-6xl font-bold text-white">{{ matchData.homeTeam.score }}</div>
          <div class="text-4xl font-bold text-gray-500">:</div>
          <div class="text-6xl font-bold text-white">{{ matchData.awayTeam.score }}</div>
        </div>

        <!-- Away Team -->
        <div class="flex flex-col items-center gap-3">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              :src="matchData.awayTeam.logo"
              :alt="matchData.awayTeam.name"
              class="w-16 h-16 object-contain"
            />
          </div>
          <span class="text-white font-semibold text-lg">{{ matchData.awayTeam.name }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4">
        <button
          @click="handleViewDetails"
          class="cursor-pointer bg-accent hover:bg-accent-hover px-12 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View Match Details
        </button>

        <!-- Optional: Add to Favorites -->
        <button
          @click="handleToggleFavorite"
          class="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            :fill="matchData.isFavorite ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {{ matchData.isFavorite ? 'Saved' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Team {
  name: string
  logo: string
  score: number
}

interface MatchBanner {
  competition: string
  matchWeek: string
  date: string
  homeTeam: Team
  awayTeam: Team
  status?: string
  isFavorite?: boolean
}

const props = withDefaults(
  defineProps<{
    matchData?: MatchBanner
  }>(),
  {
    matchData: () => ({
      competition: 'LA LIGA EA SPORTS',
      matchWeek: 'La Liga Week 22',
      date: 'Tue, 07 Feb 2025',
      status: 'Full Time',
      isFavorite: false,
      homeTeam: {
        name: 'Real Sociedad',
        logo: 'https://tmssl.akamaized.net//images/wappen/head/681.png?lm=1614795530',
        score: 5,
      },
      awayTeam: {
        name: 'Real Madrid',
        logo: 'https://tmssl.akamaized.net//images/wappen/head/418.png?lm=1729684474',
        score: 1,
      },
    }),
  },
)

const emit = defineEmits<{
  viewDetails: []
  toggleFavorite: []
  menuClick: []
}>()

const statusClass = computed(() => {
  const status = props.matchData.status?.toLowerCase() || 'full time'

  if (status.includes('live') || status.includes('1h') || status.includes('2h')) {
    return 'bg-red-500 text-white animate-pulse'
  } else if (status.includes('full time') || status.includes('ft')) {
    return 'bg-gray-600 text-white'
  } else if (status.includes('upcoming') || status.includes('scheduled')) {
    return 'bg-blue-500 text-white'
  }
  return 'bg-gray-600 text-white'
})

const handleViewDetails = () => {
  emit('viewDetails')
}

const handleToggleFavorite = () => {
  emit('toggleFavorite')
}

const handleMenuClick = () => {
  emit('menuClick')
}
</script>

<style scoped>
.bg-accent {
  background-color: var(--color-accent);
}

.bg-accent-hover {
  background-color: var(--color-accent-hover);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
