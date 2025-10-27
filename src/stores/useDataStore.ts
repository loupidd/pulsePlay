import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/matches'

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

export interface Club {
  id: number
  name: string
  image: string
  country: string
}

export interface Competition {
  id: number
  name: string
  image: string
  country: string
  clubs: Club[]
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    competitions: [] as Competition[],
    favorites: [] as number[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getCompetitionById: (state) => (id: number) => {
      return state.competitions.find((comp) => comp.id === id)
    },

    getClubById: (state) => (id: number) => {
      for (const comp of state.competitions) {
        const club = comp.clubs.find((c) => c.id === id)
        if (club) return club
      }
      return null
    },

    favoriteCompetitions: (state) => {
      return state.competitions.filter((comp) => state.favorites.includes(comp.id))
    },
  },

  actions: {
    async fetchLeaguesAndTeams() {
      this.loading = true
      this.error = null

      try {
        console.log('🔄 Fetching leagues...')
        const leaguesResponse = await axios.get<LeagueResponse[]>(`${API_BASE_URL}/leagues`)
        const leagues = leaguesResponse.data

        console.log(`✅ Fetched ${leagues.length} leagues`)

        const competitionsWithTeams = await Promise.all(
          leagues.map(async (league) => {
            try {
              console.log(`🔄 Fetching teams for league: ${league.name} (ID: ${league.id})`)

              const teamsResponse = await axios.get<TeamResponse[]>(`${API_BASE_URL}/teams`, {
                params: {
                  league: league.id,
                  season: 2022,
                },
              })

              const teams = teamsResponse.data.slice(0, 10)
              console.log(`✅ Fetched ${teams.length} teams for ${league.name}`)

              return {
                id: league.id,
                name: league.name,
                image: league.logo,
                country: league.country,
                clubs: teams.map((team) => ({
                  id: team.id,
                  name: team.name,
                  image: team.logo,
                  country: team.country,
                })),
              }
            } catch (error) {
              console.error(`❌ Error fetching teams for league ${league.id}:`, error)
              // Return league without clubs if teams fetch fails
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
        console.log(`✅ Successfully loaded ${this.competitions.length} competitions with teams`)
      } catch (error) {
        console.error('❌ Error fetching leagues and teams:', error)
        this.error = 'Failed to load competitions. Please try again.'

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Response error:', error.response.status, error.response.data)
          } else if (error.request) {
            console.error('Request error: No response received')
          } else {
            console.error('Error:', error.message)
          }
        }
      } finally {
        this.loading = false
      }
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

    addFavorite(id: number) {
      if (!this.favorites.includes(id)) {
        this.favorites.push(id)
        this.saveFavoritesToStorage()
        console.log(`Added favorite: ${id}`)
      }
    },

    removeFavorite(id: number) {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
        this.saveFavoritesToStorage()
        console.log(`Removed favorite: ${id}`)
      }
    },

    clearFavorites() {
      this.favorites = []
      this.saveFavoritesToStorage()
      console.log('Cleared all favorites')
    },

    saveFavoritesToStorage() {
      try {
        localStorage.setItem('favoriteCompetitions', JSON.stringify(this.favorites))
        console.log('Favorites saved to localStorage')
      } catch (error) {
        console.error('❌ Error saving favorites to localStorage:', error)
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
        console.error('Error loading favorites from localStorage:', error)
        this.favorites = []
      }
    },

    clearCompetitions() {
      this.competitions = []
      console.log('Cleared competitions')
    },

    setError(message: string | null) {
      this.error = message
    },

    clearError() {
      this.error = null
    },
  },
})
