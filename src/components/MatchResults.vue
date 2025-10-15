<template>
  <div class="space-y-4">
    <!-- Match Card -->
    <div
      v-for="(match, matchIndex) in matches"
      :key="match.league.name + matchIndex"
      class="main-card relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl my-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <!-- Content -->
      <div class="relative p-6 my-4">
        <!-- Header with League Info -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-3">
            <!-- League Logo -->
            <div
              class="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden"
            >
              <img
                :src="match.league.logo"
                :alt="match.league.name"
                class="w-6 h-6 object-contain"
              />
            </div>

            <div>
              <h3 class="text-gray-300 font-semibold text-sm">{{ match.league.country }}</h3>
              <p class="text-white font-bold text-xs">{{ match.league.name }}</p>
            </div>
          </div>
          <button
            @click="handleFavorite(match.id)"
            class="text-white/60 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  match.isFavorite
                    ? 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                    : 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                "
                :fill="match.isFavorite ? 'currentColor' : 'none'"
              />
            </svg>
          </button>
        </div>

        <!-- Matches List -->
        <div class="space-y-2.5">
          <div
            v-for="(game, gameIndex) in match.games"
            :key="game.homeTeam.name + game.awayTeam.name + gameIndex"
            class="main-card flex items-center rounded-xl py-3.5 px-4 hover:bg-white/15 transition-all cursor-pointer"
            @click="handleMatchClick(matchIndex, gameIndex)"
          >
            <!-- Home Team -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0"
              >
                <img
                  :src="game.homeTeam.logo"
                  :alt="game.homeTeam.name"
                  class="w-5 h-5 object-contain"
                />
              </div>
              <span class="text-white font-medium truncate text-sm">{{ game.homeTeam.name }}</span>
            </div>

            <!-- Score -->
            <div class="flex items-center justify-center gap-4 flex-shrink-0 px-6">
              <span class="text-white font-bold text-lg min-w-[1rem] text-center">{{
                game.homeTeam.score
              }}</span>
              <span class="text-white/50 font-bold text-sm">:</span>
              <span class="text-white font-bold text-lg min-w-[1rem] text-center">{{
                game.awayTeam.score
              }}</span>
            </div>

            <!-- Away Team -->
            <div class="flex items-center gap-3 flex-1 min-w-0 justify-end">
              <span class="text-white font-medium truncate text-sm text-right">{{
                game.awayTeam.name
              }}</span>
              <div
                class="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0"
              >
                <img
                  :src="game.awayTeam.logo"
                  :alt="game.awayTeam.name"
                  class="w-5 h-5 object-contain"
                />
              </div>
            </div>

            <!-- Arrow Icon -->
            <svg
              class="w-4 h-4 text-white/60 ml-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Team {
  name: string
  logo: string
  score: number
}

interface Game {
  id?: string
  homeTeam: Team
  awayTeam: Team
}

interface League {
  name: string
  country: string
  logo: string
}

interface Match {
  id: string
  league: League
  games: Game[]
  gradientFrom: string
  gradientTo: string
  isFavorite: boolean
}

const matches = ref<Match[]>([])

const emit = defineEmits<{
  matchClick: [matchId: string]
  favoriteToggle: [matchId: string]
}>()

const handleMatchClick = (matchIndex: number, gameIndex: number) => {
  emit('matchClick', `${matchIndex}-${gameIndex}`)
}

const handleFavorite = (matchId: string) => {
  const match = matches.value.find((m) => m.id === matchId)
  if (match) {
    match.isFavorite = !match.isFavorite
    emit('favoriteToggle', matchId!)
  }
}
// fetch data from api
const fetchRecentMatches = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/matches/recent', {
      params: {
        league: 39, // Premier League
        season: 2023,
        limit: 5,
      },
    })
    matches.value = response.data
  } catch (error) {
    console.error('Error fetching recent matches:', error)
  }
}

onMounted(() => {
  fetchRecentMatches()
})
</script>

<style>
.main-card {
  margin-bottom: 12px;
  margin-top: 12px;
}
</style>
