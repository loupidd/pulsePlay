import { defineStore } from 'pinia'
import axios from 'axios'

export interface FilterItem {
  id: number
  name: string
  image: string
  type: 'competition'
}

interface LeagueResponse {
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
}

interface FilterState {
  selectedFilters: FilterItem[]
  competitions: Competition[]
  loading: boolean
  error: string | null
}

export const useFilterStore = defineStore('filter', {
  state: (): FilterState => ({
    selectedFilters: [],
    competitions: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasFilters: (state) => state.selectedFilters.length > 0,
    filterIds: (state) => state.selectedFilters.map((f) => f.id),
    competitionFilters: (state) => state.selectedFilters.filter((f) => f.type === 'competition'),

    activeCompetitionIds: (state) => {
      const ids = state.selectedFilters.filter((f) => f.type === 'competition').map((f) => f.id)
      return ids.length > 0 ? ids : []
    },

    // Add this for backward compatibility
    activeClubIds: () => {
      return []
    },
  },

  actions: {
    addFilter(filter: FilterItem) {
      if (!this.selectedFilters.some((f) => f.id === filter.id)) {
        this.selectedFilters.push(filter)
        console.log('Filter added:', filter.name)
      }
    },

    removeFilter(filterId: number) {
      const index = this.selectedFilters.findIndex((f) => f.id === filterId)
      if (index > -1) {
        const removed = this.selectedFilters.splice(index, 1)[0]
        console.log('Filter removed:', removed.name)
      }
    },

    clearFilters() {
      this.selectedFilters = []
      console.log('All filters cleared')
    },

    async fetchLeaguesAndTeams() {
      if (this.competitions.length > 0) {
        console.log('Competitions already loaded:', this.competitions.length)
        return
      }

      this.loading = true
      this.error = null
      console.log('Fetching leagues from backend...')

      try {
        const response = await axios.get('http://localhost:8080/api/matches/leagues')
        const leagues = response.data as LeagueResponse[]

        console.log('=== BACKEND RESPONSE ===')
        console.log('Total leagues returned:', leagues.length)
        console.log(
          'League IDs:',
          leagues.map((l) => `${l.id} (${l.name})`),
        )
        console.log('Full data:', JSON.stringify(leagues, null, 2))
        console.log('========================')

        this.competitions = leagues.map((league: LeagueResponse) => ({
          id: league.id,
          name: league.name,
          image: league.logo,
          country: league.country,
        }))

        console.log('Competitions stored:', this.competitions.length)
      } catch (error) {
        this.error = 'Failed to load competitions'
        console.error('Error fetching leagues:', error)

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Response status:', error.response.status)
            console.error('Response data:', error.response.data)
          } else if (error.request) {
            console.error('No response received from server')
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
})
