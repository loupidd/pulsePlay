import { defineStore } from 'pinia'
import axios from 'axios'

export interface FilterItem {
  id: number
  name: string
  image: string
  type: 'club' | 'competition'
}

interface LeagueResponse {
  id: number
  name: string
  logo: string
  country: string
}

interface TeamResponse {
  id: number
  name: string
  logo: string
  country: string
}

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

interface FilterState {
  selectedFilters: FilterItem[]
  favorites: number[]
  competitions: Competition[]
  loading: boolean
  error: string | null
}

export const useFilterStore = defineStore('filter', {
  state: (): FilterState => ({
    selectedFilters: [],
    favorites: [],
    competitions: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasFilters: (state) => state.selectedFilters.length > 0,
    filterIds: (state) => state.selectedFilters.map((f) => f.id),
    competitionFilters: (state) => state.selectedFilters.filter((f) => f.type === 'competition'),
    clubFilters: (state) => state.selectedFilters.filter((f) => f.type === 'club'),

    // These getters are used by MatchResults.vue
    activeCompetitionIds: (state) => {
      const ids = state.selectedFilters.filter((f) => f.type === 'competition').map((f) => f.id)
      // Return empty array if no filters, don't send anything
      return ids.length > 0 ? ids : []
    },

    activeClubIds: (state) => {
      const ids = state.selectedFilters.filter((f) => f.type === 'club').map((f) => f.id)
      // Return empty array if no filters, don't send anything
      return ids.length > 0 ? ids : []
    },
  },

  actions: {
    addFilter(filter: FilterItem) {
      if (!this.selectedFilters.some((f) => f.id === filter.id)) {
        this.selectedFilters.push(filter)
        console.log(`✅ Filter added: ${filter.name} (${filter.type})`)
      } else {
        console.warn(`⚠️ Filter already exists: ${filter.name}`)
      }
    },

    removeFilter(filterId: number) {
      const index = this.selectedFilters.findIndex((f) => f.id === filterId)
      if (index > -1) {
        const removed = this.selectedFilters.splice(index, 1)[0]
        console.log(`Filter removed: ${removed.name}`)
      } else {
        console.warn(`⚠️ Filter not found with id: ${filterId}`)
      }
    },

    clearFilters() {
      const count = this.selectedFilters.length
      this.selectedFilters = []
      console.log(`🧹 Cleared ${count} filters`)
    },

    toggleFavorite(id: number) {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
        console.log(`Removed favorite: ${id}`)
      } else {
        this.favorites.push(id)
        console.log(`Added favorite: ${id}`)
      }
      this.saveFavoritesToStorage()
    },

    saveFavoritesToStorage() {
      try {
        localStorage.setItem('favoriteCompetitions', JSON.stringify(this.favorites))
        console.log(`Saved ${this.favorites.length} favorites to localStorage`)
      } catch (error) {
        console.error('❌ Failed to save favorites to localStorage:', error)
      }
    },

    loadFavoritesFromStorage() {
      try {
        const savedFavorites = localStorage.getItem('favoriteCompetitions')
        if (savedFavorites) {
          this.favorites = JSON.parse(savedFavorites)
          console.log(`Loaded ${this.favorites.length} favorites from localStorage`)
        }
      } catch (error) {
        console.error('❌ Failed to load favorites from localStorage:', error)
      }
    },

    async fetchLeaguesAndTeams() {
      // Don't auto-fetch on mount - let users add manually
      console.log('📋 Leagues and teams available for manual selection')

      // Only fetch if explicitly called
      if (this.competitions.length > 0) {
        console.log('✅ Competitions already loaded')
        return
      }

      this.loading = true
      this.error = null
      console.log('🔄 Starting to fetch leagues and teams...')

      try {
        const startTime = performance.now()

        // Fetch leagues
        console.log('🌐 Fetching leagues from API...')
        const leaguesResponse = await axios.get('http://localhost:8080/api/matches/leagues')
        const leagues = leaguesResponse.data as LeagueResponse[]
        console.log(`✅ Fetched ${leagues.length} leagues`)

        // Fetch teams for each league in parallel
        console.log('🌐 Fetching teams for each league...')
        const competitionsWithTeams = await Promise.all(
          leagues.map(async (league: LeagueResponse) => {
            try {
              console.log(`  ↳ Fetching teams for league: ${league.name} (ID: ${league.id})`)
              const teamsResponse = await axios.get('http://localhost:8080/api/matches/teams', {
                params: { league: league.id, season: 2022 },
              })
              const teams = teamsResponse.data as TeamResponse[] // Get ALL teams, not just 10
              console.log(`    ✅ Fetched ${teams.length} teams for ${league.name}`)

              return {
                id: league.id,
                name: league.name,
                image: league.logo,
                country: league.country,
                clubs: teams.map((team: TeamResponse) => ({
                  id: team.id,
                  name: team.name,
                  image: team.logo,
                  country: team.country,
                })),
              }
            } catch (error) {
              console.error(`❌ Failed to fetch teams for league ${league.name}:`, error)
              return {
                id: league.id,
                name: league.name,
                image: league.logo,
                country: league.country,
                clubs: [],
              }
            }
          }),
        )

        this.competitions = competitionsWithTeams
        const endTime = performance.now()
        const duration = ((endTime - startTime) / 1000).toFixed(2)

        const totalClubs = competitionsWithTeams.reduce((sum, comp) => sum + comp.clubs.length, 0)
        console.log(
          `✅ Successfully loaded ${competitionsWithTeams.length} competitions with ${totalClubs} total clubs in ${duration}s`,
        )
      } catch (error) {
        this.error = 'Failed to load competitions'
        console.error('❌ Error fetching leagues and teams:', error)

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error(`   Status: ${error.response.status}`)
            console.error(`   Data:`, error.response.data)
          } else if (error.request) {
            console.error('   No response received from server')
          } else {
            console.error('   Request setup error:', error.message)
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
})
