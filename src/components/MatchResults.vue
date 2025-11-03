<template>
  <div class="match-results-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      <p class="text-white/60 mt-4 text-sm">
        {{ isSearching ? 'Searching matches...' : 'Loading matches...' }}
      </p>
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
        @click="fetchRecentMatches(1)"
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
      <h3 class="text-white text-xl font-bold mb-2">
        {{ isSearching ? 'No Matches Found' : 'No Matches Available' }}
      </h3>
      <p class="text-white/60 mb-6 px-4 max-w-md mx-auto">
        {{
          isSearching
            ? `No matches found for "${currentSearchQuery}". Try a different club name.`
            : 'There are no matches available for the selected criteria. Try adjusting your filters or check back later.'
        }}
      </p>
      <button
        @click="isSearching ? handleClearSearch() : fetchRecentMatches(1)"
        class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 font-medium"
      >
        {{ isSearching ? 'Clear Search' : 'Refresh' }}
      </button>
    </div>

    <!-- Date Cards -->
    <div
      v-for="dateCard in matches"
      :key="dateCard.id"
      class="date-card"
      :style="{
        backgroundImage: `linear-gradient(135deg, ${dateCard.gradientFrom}, ${dateCard.gradientTo})`,
      }"
    >
      <div class="date-card-content">
        <!-- Date Header -->
        <div class="date-header">
          <div class="date-header-icon">
            <svg class="icon-calendar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="date-header-info">
            <h2 class="date-title">{{ dateCard.date }}</h2>
            <p class="date-subtitle">
              {{ getTotalMatches(dateCard) }} match{{
                getTotalMatches(dateCard) !== 1 ? 'es' : ''
              }}
              across {{ dateCard.leagues.length }} league{{
                dateCard.leagues.length > 1 ? 's' : ''
              }}
            </p>
          </div>
          <button
            @click="handleFavorite(dateCard.id)"
            class="favorite-button"
            :class="{ 'is-favorite': dateCard.isFavorite }"
          >
            <svg class="favorite-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="league-logo-wrapper">
                <img
                  :src="leagueSection.league.logo"
                  :alt="leagueSection.league.name"
                  class="league-logo"
                />
              </div>
              <div class="league-info">
                <h3 class="league-name">{{ leagueSection.league.name }}</h3>
                <p class="league-meta">
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
                class="game-row"
                @click="handleMatchClick(game.id)"
              >
                <div class="game-row-bg"></div>

                <div class="game-content">
                  <!-- Home Team -->
                  <div class="team-section team-home">
                    <div class="team-logo-wrapper">
                      <img :src="game.homeTeam.logo" :alt="game.homeTeam.name" class="team-logo" />
                    </div>
                    <span class="team-name">{{ game.homeTeam.name }}</span>
                  </div>

                  <!-- Score -->
                  <div class="score-section">
                    <span class="score">{{ game.homeTeam.score }}</span>
                    <span class="score-separator">—</span>
                    <span class="score">{{ game.awayTeam.score }}</span>
                  </div>

                  <!-- Away Team -->
                  <div class="team-section team-away">
                    <span class="team-name">{{ game.awayTeam.name }}</span>
                    <div class="team-logo-wrapper">
                      <img :src="game.awayTeam.logo" :alt="game.awayTeam.name" class="team-logo" />
                    </div>
                  </div>

                  <!-- Arrow Icon -->
                  <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="matches.length > 0 && !loading && !isSearching" class="load-more-container">
      <button @click="loadMore" class="load-more-button">
        <span class="load-more-content">
          Load More Matches
          <svg class="load-more-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useFilterStore } from '@/stores/useFilterStore'
import { useSearchStore } from '@/stores/searchStore'

interface Team {
  id?: number
  name: string
  logo: string
  score: number
}

interface Game {
  id: string
  homeTeam: Team
  awayTeam: Team
}

interface League {
  id: string
  name: string
  country: string
  logo: string
}

interface LeagueSection {
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
const isSearching = ref(false)
const currentSearchQuery = ref('')

const filterStore = useFilterStore()
const searchStore = useSearchStore()

const store = useFilterStore()
const emit = defineEmits<{
  matchClick: [matchId: string]
  favoriteToggle: [dateId: string]
}>()

const getTotalMatches = (dateCard: DateCard): number => {
  return dateCard.leagues.reduce((total, league) => total + league.games.length, 0)
}

const handleMatchClick = (gameId: string): void => {
  if (gameId) emit('matchClick', gameId)
}

const handleFavorite = (dateId: string): void => {
  const dateCard = matches.value.find((m) => m.id === dateId)
  if (dateCard) {
    dateCard.isFavorite = !dateCard.isFavorite
    emit('favoriteToggle', dateId)
  }
}

const fetchRecentMatches = async (page: number = 1) => {
  loading.value = true
  error.value = null
  isSearching.value = false
  currentSearchQuery.value = ''

  console.log('Fetching matches - Page:', page)

  try {
    const params: {
      season: number
      limit: number
      page: number
      leagues?: string
    } = {
      season: 2023,
      limit: 30,
      page,
    }

    if (filterStore.activeCompetitionIds?.length > 0) {
      params.leagues = filterStore.activeCompetitionIds.join(',')
    }

    const response = await axios.get('http://localhost:8080/api/matches/recent', { params })
    const data = response.data as DateCard[]

    matches.value = page === 1 ? data : [...matches.value, ...data]
    currentPage.value = page
  } catch (err) {
    console.error('Error fetching matches:', err)
    error.value = 'Failed to load matches. Please try again.'
  } finally {
    loading.value = false
  }
}

const searchMatches = async (query: string, page: number = 1) => {
  if (!query.trim()) {
    fetchRecentMatches(1)
    return
  }

  loading.value = true
  error.value = null
  isSearching.value = true
  currentSearchQuery.value = query

  console.log('Searching matches for:', query)

  try {
    const params: {
      query: string
      season: number
      limit: number
      page: number
      leagues?: string
    } = {
      query: query.trim(),
      season: 2023,
      limit: 20,
      page,
    }

    if (filterStore.activeCompetitionIds?.length > 0) {
      params.leagues = filterStore.activeCompetitionIds.join(',')
    }

    const response = await axios.get('http://localhost:8080/api/matches/search', { params })
    const data = response.data as DateCard[]

    matches.value = data
    currentPage.value = page
    console.log('Search results:', data.length, 'date cards')
  } catch (err) {
    console.error('Error searching matches:', err)
    error.value = 'Failed to search matches. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleClearSearch = () => {
  searchStore.clearSearch()
  isSearching.value = false
  currentSearchQuery.value = ''
  fetchRecentMatches(1)
}

const loadMore = (): void => {
  fetchRecentMatches(currentPage.value + 1)
}

defineExpose({
  fetchRecentMatches,
  searchMatches,
  clearSearch: handleClearSearch,
})

onMounted(() => {
  console.log('MatchResults mounted')
  fetchRecentMatches(1)
})

// Watch for filter changes
watch(
  () => filterStore.activeCompetitionIds,
  () => {
    console.log('Filters changed')
    if (isSearching.value && currentSearchQuery.value) {
      searchMatches(currentSearchQuery.value, 1)
    } else {
      fetchRecentMatches(1)
    }
  },
  { deep: true },
)

// Watch for search query changes from the navbar
watch(
  () => searchStore.searchQuery,
  (newQuery, oldQuery) => {
    console.log('Search query changed from:', oldQuery, 'to:', newQuery)
    if (newQuery && newQuery.trim()) {
      console.log('Triggering search for:', newQuery)
      searchMatches(newQuery, 1)
    } else if (oldQuery && !newQuery) {
      console.log('Search cleared, fetching recent matches')
      fetchRecentMatches(1)
    }
  },
)
</script>

<style scoped>
/* Container */
.match-results-container {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
}

@media (min-width: 768px) {
  .match-results-container {
    padding: 0;
    gap: 2rem;
  }
}

/* Date Card */
.date-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
}

@media (min-width: 768px) {
  .date-card {
    border-radius: 1.5rem;
  }
}

.date-card:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.date-card-content {
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .date-card-content {
    padding: 2rem;
  }
}

/* Date Header */
.date-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 768px) {
  .date-header {
    gap: 1.25rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
}

.date-header-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .date-header-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1rem;
  }
}

.icon-calendar {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

@media (min-width: 768px) {
  .icon-calendar {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.date-header-info {
  flex: 1;
  min-width: 0;
}

.date-title {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.4;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .date-title {
    font-size: 1.5rem;
    margin-bottom: 0.375rem;
  }
}

.date-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .date-subtitle {
    font-size: 0.875rem;
  }
}

.favorite-button {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .favorite-button {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.75rem;
  }
}

.favorite-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.favorite-icon {
  width: 1rem;
  height: 1rem;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.4);
}

@media (min-width: 768px) {
  .favorite-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.favorite-button:hover .favorite-icon {
  color: rgba(255, 255, 255, 0.7);
}

.favorite-button.is-favorite .favorite-icon {
  color: #fbbf24;
}

/* League Sections */
.league-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .league-sections {
    gap: 2.5rem;
  }
}

.league-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 2rem;
}

@media (min-width: 768px) {
  .league-section:not(:last-child) {
    padding-bottom: 2.5rem;
  }
}

/* League Header */
.league-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .league-header {
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
}

.league-logo-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .league-logo-wrapper {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
  }
}

.league-logo {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

@media (min-width: 768px) {
  .league-logo {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.league-info {
  flex: 1;
  min-width: 0;
}

.league-name {
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.4;
  margin: 0 0 0.125rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .league-name {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
}

.league-meta {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .league-meta {
    font-size: 0.875rem;
  }
}

/* Games List */
.games-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

@media (min-width: 768px) {
  .games-list {
    gap: 0.75rem;
  }
}

.game-row {
  position: relative;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  padding: 1rem 0.75rem;
  border: 1px solid transparent;
}

@media (min-width: 768px) {
  .game-row {
    border-radius: 1rem;
    padding: 1.25rem 1rem;
  }
}

.game-row-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  transition: all 0.3s ease;
  border-radius: inherit;
}

.game-row:hover .game-row-bg {
  background: rgba(255, 255, 255, 0.1);
}

.game-row:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.game-content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .game-content {
    gap: 1rem;
  }
}

/* Team Section */
.team-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

@media (min-width: 768px) {
  .team-section {
    gap: 0.75rem;
  }
}

.team-home {
  justify-content: flex-start;
}

.team-away {
  justify-content: flex-end;
}

.team-logo-wrapper {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .team-logo-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
  }
}

.game-row:hover .team-logo-wrapper {
  transform: scale(1.1);
}

.team-logo {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
}

@media (min-width: 768px) {
  .team-logo {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.team-name {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .team-name {
    font-size: 1rem;
  }
}

.team-home .team-name {
  order: 1;
}

.game-row:hover .team-home .team-name {
  transform: translateX(0.25rem);
}

.game-row:hover .team-away .team-name {
  transform: translateX(-0.25rem);
}

/* Score Section */
.score-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

@media (min-width: 768px) {
  .score-section {
    gap: 1rem;
    padding: 0 1rem;
  }
}

.score {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1;
  min-width: 1.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

@media (min-width: 768px) {
  .score {
    font-size: 1.5rem;
    min-width: 2rem;
  }
}

.score-separator {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1;
}

@media (min-width: 768px) {
  .score-separator {
    font-size: 1.125rem;
  }
}

/* Arrow Icon */
.arrow-icon {
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0);
  transition: all 0.3s ease;
  display: none;
}

@media (min-width: 640px) {
  .arrow-icon {
    display: block;
  }
}

@media (min-width: 768px) {
  .arrow-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.game-row:hover .arrow-icon {
  color: rgba(255, 255, 255, 0.6);
  transform: translateX(0.25rem);
}

/* Load More */
.load-more-container {
  text-align: center;
  padding: 1.5rem 0;
}

@media (min-width: 768px) {
  .load-more-container {
    padding: 2rem 0;
  }
}

.load-more-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .load-more-button {
    padding: 1rem 2rem;
    border-radius: 1rem;
    font-size: 1rem;
  }
}

.load-more-button:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.load-more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.load-more-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .load-more-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.load-more-button:hover .load-more-icon {
  transform: translateY(0.25rem);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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
}

.match-results-container {
  width: 100%;
  max-width: 100%;
}
</style>
