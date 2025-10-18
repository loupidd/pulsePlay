<template>
  <div class="match-results-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      <p class="text-white/60 mt-4 text-sm">Loading matches...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-400/20 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p class="text-red-400 mb-6 px-4">{{ error }}</p>
      <button
        @click="() => fetchRecentMatches(1)"
        class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 font-medium"
      >
        Try Again
      </button>
    </div>

    <!-- No Data State -->
    <div v-else-if="!loading && matches.length === 0" class="text-center py-16">
      <div class="text-white/20 mb-6">
        <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-white text-xl font-bold mb-2">No Matches Found</h3>
      <p class="text-white/60 mb-6 px-4 max-w-md mx-auto">
        There are no matches available for the selected criteria. Try adjusting your filters or
        check back later.
      </p>
      <button
        @click="() => fetchRecentMatches(1)"
        class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 font-medium"
      >
        Refresh
      </button>
    </div>

    <!-- Date Cards -->
    <div
      v-for="dateCard in matches"
      :key="dateCard.id"
      class="date-card relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl"
      :style="{
        backgroundImage: `linear-gradient(135deg, ${dateCard.gradientFrom}, ${dateCard.gradientTo})`,
      }"
    >
      <div class="date-card-content">
        <!-- Date Header -->
        <div class="date-header">
          <div class="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div
              class="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5 md:w-7 md:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-white font-bold text-lg md:text-2xl tracking-tight truncate">
                {{ dateCard.date }}
              </h2>
              <p class="text-white/50 text-xs md:text-sm mt-1 truncate">
                {{ getTotalMatches(dateCard) }} matches across
                {{ dateCard.leagues.length }} league{{ dateCard.leagues.length > 1 ? 's' : '' }}
              </p>
  <div class="space-y-4">
    <!-- 🆕 Debug info -->
    <div class="bg-blue-900/50 p-4 rounded text-white text-sm mb-4">
      <p>Matches count: {{ matches.length }}</p>
      <p>Matches data: {{ matches }}</p>
    </div>
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
            @click="handleFavorite(dateCard.id)"
            class="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all duration-300 group flex-shrink-0"
          >
            <svg
              class="w-4 h-4 md:w-5 md:h-5 transition-all duration-300"
              :class="
                dateCard.isFavorite ? 'text-yellow-400' : 'text-white/40 group-hover:text-white/70'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  dateCard.isFavorite
                    ? 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                    : 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                "
                :fill="dateCard.isFavorite ? 'currentColor' : 'none'"
              />
            </svg>
          </button>
        </div>

        <!-- League Sections -->
        <div class="league-sections">
          <div
            v-for="(leagueSection, leagueIndex) in dateCard.leagues"
            :key="leagueSection.league.id || leagueIndex"
            class="league-section"
          >
            <!-- League Header -->
            <div class="league-header">
              <div
                class="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/95 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0"
              >
                <img
                  :src="leagueSection.league.logo"
                  :alt="leagueSection.league.name"
                  class="w-6 h-6 md:w-7 md:h-7 object-contain"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-white font-bold text-base md:text-lg truncate">
                  {{ leagueSection.league.name }}
                </h3>
                <p class="text-white/50 text-xs md:text-sm truncate">
                  {{ leagueSection.league.country }} • {{ leagueSection.games.length }} match{{
                    leagueSection.games.length > 1 ? 'es' : ''
                  }}
                </p>
              </div>
            </div>

            <!-- Games List -->
            <div class="games-list">
              <div
                v-for="(game, gameIndex) in leagueSection.games"
                :key="game.id || gameIndex"
                class="game-row group relative rounded-xl md:rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                @click="handleMatchClick(game.id)"
              >
                <!-- Hover Background -->
                <div
                  class="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-xl md:rounded-2xl"
                ></div>

                <!-- Content -->
                <div class="relative flex items-center gap-2 md:gap-0">
                  <!-- Home Team -->
                  <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    <div
                      class="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/95 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
                    >
                      <img
                        :src="game.homeTeam.logo"
                        :alt="game.homeTeam.name"
                        class="w-5 h-5 md:w-7 md:h-7 object-contain"
                      />
                    </div>
                    <span
                      class="text-white font-semibold truncate text-sm md:text-base group-hover:translate-x-1 transition-transform duration-300"
                    >
                      {{ game.homeTeam.name }}
                    </span>
                  </div>

                  <!-- Score -->
                  <div
                    class="flex items-center justify-center gap-2 md:gap-5 flex-shrink-0 px-2 md:px-8"
                  >
                    <span
                      class="text-white font-bold text-lg md:text-2xl min-w-[1.5rem] md:min-w-[2rem] text-center tabular-nums"
                    >
                      {{ game.homeTeam.score }}
                    </span>
                    <span class="text-white/30 font-bold text-sm md:text-lg">—</span>
                    <span
                      class="text-white font-bold text-lg md:text-2xl min-w-[1.5rem] md:min-w-[2rem] text-center tabular-nums"
                    >
                      {{ game.awayTeam.score }}
                    </span>
                  </div>

                  <!-- Away Team -->
                  <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0 justify-end">
                    <span
                      class="text-white font-semibold truncate text-sm md:text-base text-right group-hover:-translate-x-1 transition-transform duration-300"
                    >
                      {{ game.awayTeam.name }}
                    </span>
                    <div
                      class="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/95 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
                    >
                      <img
                        :src="game.awayTeam.logo"
                        :alt="game.awayTeam.name"
                        class="w-5 h-5 md:w-7 md:h-7 object-contain"
                      />
                    </div>
                  </div>

                  <!-- Arrow Icon -->
                  <svg
                    class="w-4 h-4 md:w-5 md:h-5 text-white/0 group-hover:text-white/60 ml-2 md:ml-6 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 hidden sm:block"
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
            v-for="(game, gameIndex) in match.games"
            :key="game.id || game.homeTeam.name + game.awayTeam.name + gameIndex"
            class="game-container"
          >
            <!--  League badge for each game (when multiple leagues) -->
            <div v-if="game.league" class="league-badge-small">
              <img :src="game.league.logo" :alt="game.league.name" class="w-4 h-4 object-contain" />
              <span class="text-white/50 text-xs">{{ game.league.name }}</span>
            </div>

            <!-- Match row -->
            <div
              class="main-card flex items-center rounded-xl py-3.5 px-4 hover:bg-white/15 transition-all cursor-pointer"
              @click="handleMatchClick(game.id)"
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
                <span class="text-white font-medium truncate text-sm">{{
                  game.homeTeam.name
                }}</span>
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

    <!-- Load More Button -->
    <div v-if="matches.length > 0 && !loading" class="load-more-container">
      <button
        @click="loadMore"
        class="group px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 rounded-xl md:rounded-2xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <span class="flex items-center justify-center gap-3">
          Load More Matches
          <svg
            class="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
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

interface League {
  id: string
  name: string
  country: string
  logo: string
}

interface LeagueSection {
interface Game {
  id?: string
  league?: League
  homeTeam: Team
  awayTeam: Team
}

interface Match {
  id: string
  league: League
  games: Game[]
}

interface DateCard {
  id: string
  date: string
  leagues: LeagueSection[]
  gradientFrom: string
  gradientTo: string
  isFavorite: boolean
}

const matches = ref<DateCard[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const matches = ref<Match[]>([])

const emit = defineEmits<{
  matchClick: [matchId: string]
  favoriteToggle: [dateId: string]
}>()

const getTotalMatches = (dateCard: DateCard): number => {
  return dateCard.leagues.reduce((total, league) => total + league.games.length, 0)
// Handle match click - Directly accept matchId and emit it
const handleMatchClick = (gameId?: string) => {
  if (gameId) {
    emit('matchClick', gameId)
  }
}

const handleMatchClick = (gameId: string): void => {
  if (gameId) {
    emit('matchClick', gameId)
  }
}

const handleFavorite = (dateId: string): void => {
  const dateCard = matches.value.find((m) => m.id === dateId)
  if (dateCard) {
    dateCard.isFavorite = !dateCard.isFavorite
    emit('favoriteToggle', dateId)
  }
}

const fetchRecentMatches = async (page: number = 1): Promise<void> => {
  console.log('Starting to fetch matches... Page:', page)
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('http://localhost:8080/api/matches/recent', {
      params: {
        season: 2022,
        limit: 30,
        page: page,
      },
    })

    console.log('API Response received:', response.data)

    if (page === 1) {
      matches.value = response.data
    } else {
      matches.value = [...matches.value, ...response.data]
    }

    currentPage.value = page
  } catch (err) {
    console.error('Error fetching recent matches:', err)
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to load matches. Please try again.'
      console.error('Response data:', err.response?.data)
      console.error('Response status:', err.response?.status)
    } else {
      error.value = 'An unexpected error occurred'
    }
  } finally {
    loading.value = false
  }
}

const loadMore = (): void => {
  fetchRecentMatches(currentPage.value + 1)
}

onMounted(() => {
  fetchRecentMatches(1)
// fetch data from api
const fetchRecentMatches = async () => {
  console.log('🔄 Starting to fetch matches...')
  try {
    console.log('📡 Making API call to:', 'http://localhost:8080/api/matches/recent')
    const response = await axios.get('http://localhost:8080/api/matches/recent', {
      params: {
        season: 2023,
        limit: 30,
      },
    })
    console.log('✅ API Response received:', response)
    console.log('📊 Response data:', response.data)
    console.log('📏 Data length:', response.data?.length)

    matches.value = response.data
    console.log('✅ Matches assigned:', matches.value)
  } catch (error) {
    console.error('❌ Error fetching recent matches:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
    }
  }
}

onMounted(() => {
  fetchRecentMatches()
})
</script>

<style scoped>
.match-results-container {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (min-width: 768px) {
  .match-results-container {
    padding: 0;
    gap: 40px;
  }
}

.date-card {
  backdrop-filter: blur(20px);
  margin-bottom: 0;
}

.date-card-content {
  padding: 24px 20px;
}

@media (min-width: 768px) {
  .date-card-content {
    padding: 40px 32px;
  }
}

.date-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 16px;
}

@media (min-width: 768px) {
  .date-header {
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 32px;
  }
}

.league-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (min-width: 768px) {
  .league-sections {
    gap: 48px;
  }
}

.league-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 32px;
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .league-section:not(:last-child) {
    padding-bottom: 48px;
  }
}

.league-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .league-header {
    gap: 20px;
    margin-bottom: 24px;
  }
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .games-list {
    gap: 16px;
  }
}

.game-row {
  border: 1px solid transparent;
  padding: 16px 12px;
  min-height: 70px;
}

@media (min-width: 768px) {
  .game-row {
    padding: 20px 24px;
    min-height: 80px;
  }
}

.game-row:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.load-more-container {
  text-align: center;
  padding: 32px 0;
}

@media (min-width: 768px) {
  .load-more-container {
    padding: 40px 0;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
.main-card {
  margin-bottom: 12px;
  margin-top: 12px;
}
/* League Badge Styling */
.game-container {
  margin-bottom: 8px;
}

.league-badge-small {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin-bottom: 4px;
  margin-left: 4px;
}
</style>
