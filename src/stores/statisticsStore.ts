import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

export interface Team {
  id: number
  name: string
  logo: string
}

export interface Player {
  id: number
  name: string
  image: string
  team: Team
  nationality: string
}

export interface Scorer extends Player {
  goals: number
}

export interface Assister extends Player {
  assists: number
}

export interface Keeper extends Player {
  cleanSheets: number
}

export interface News {
  id: string
  title: string
  date: string
  image: string
  description?: string
  url?: string
  source?: string
  publishedAt?: string
  isBookmarked: boolean
}

export interface League {
  id: number
  name: string
  season: string
}

interface ErrorResponse {
  message?: string
}

export const useStatisticsStore = defineStore('statistics', () => {
  // State
  const topScorers = ref<Scorer[]>([])
  const topAssists = ref<Assister[]>([])
  const cleanSheets = ref<Keeper[]>([])
  const news = ref<News[]>([])
  const featuredNews = ref<News | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Available leagues with seasons (using 2023 due to API limitations)
  const availableLeagues = ref<League[]>([
    { id: 39, name: 'Premier League', season: '2023' },
    { id: 140, name: 'La Liga', season: '2023' },
    { id: 78, name: 'Bundesliga', season: '2023' },
    { id: 135, name: 'Serie A', season: '2023' },
    { id: 61, name: 'Ligue 1', season: '2023' },
  ])

  // Helper function to handle errors
  const handleError = (err: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ErrorResponse>
      return axiosError.response?.data?.message || defaultMessage
    }
    return defaultMessage
  }

  // Fetch top scorers
  const fetchTopScorers = async (leagueId: number, season: string, limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      console.log('📡 Fetching top scorers:', { leagueId, season, limit })
      const response = await axios.get<Scorer[]>(`${API_BASE_URL}/statistics/top-scorers`, {
        params: { league: leagueId, season, limit },
      })
      topScorers.value = response.data
      console.log('✅ Top scorers loaded:', response.data.length, 'players')
    } catch (err: unknown) {
      error.value = handleError(err, 'Failed to fetch top scorers')
      console.error('❌ Error fetching top scorers:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch top assists
  const fetchTopAssists = async (leagueId: number, season: string, limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      console.log('📡 Fetching top assists:', { leagueId, season, limit })
      const response = await axios.get<Assister[]>(`${API_BASE_URL}/statistics/top-assists`, {
        params: { league: leagueId, season, limit },
      })
      topAssists.value = response.data
      console.log('✅ Top assists loaded:', response.data.length, 'players')
    } catch (err: unknown) {
      error.value = handleError(err, 'Failed to fetch top assists')
      console.error('❌ Error fetching top assists:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch clean sheets
  const fetchCleanSheets = async (leagueId: number, season: string, limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      console.log('📡 Fetching clean sheets:', { leagueId, season, limit })
      const response = await axios.get<Keeper[]>(`${API_BASE_URL}/statistics/clean-sheets`, {
        params: { league: leagueId, season, limit },
      })
      cleanSheets.value = response.data
      console.log('✅ Clean sheets loaded:', response.data.length, 'players')
    } catch (err: unknown) {
      error.value = handleError(err, 'Failed to fetch clean sheets')
      console.error('❌ Error fetching clean sheets:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch news from Football News Aggregator API
  const fetchNews = async (limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      console.log('📡 Fetching news:', { limit })
      const response = await axios.get<News[]>(`${API_BASE_URL}/news/trending`, {
        params: { source: 'espn', limit },
      })
      const newsData = response.data

      if (newsData.length > 0) {
        featuredNews.value = newsData[0]
        news.value = newsData.slice(1)
      }
      console.log('✅ News loaded:', newsData.length, 'articles')
    } catch (err: unknown) {
      error.value = handleError(err, 'Failed to fetch news')
      console.error('❌ Error fetching news:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch all statistics for a league
  const fetchAllStatistics = async (leagueId: number, season: string) => {
    await Promise.all([
      fetchTopScorers(leagueId, season),
      fetchTopAssists(leagueId, season),
      fetchCleanSheets(leagueId, season),
      fetchNews(),
    ])
  }

  // Toggle bookmark
  const toggleBookmark = (newsId: string) => {
    const newsItem = news.value.find((n) => n.id === newsId)
    if (newsItem) {
      newsItem.isBookmarked = !newsItem.isBookmarked
    }
    if (featuredNews.value?.id === newsId) {
      featuredNews.value.isBookmarked = !featuredNews.value.isBookmarked
    }
  }

  return {
    // State
    topScorers,
    topAssists,
    cleanSheets,
    news,
    featuredNews,
    availableLeagues,
    loading,
    error,

    // Actions
    fetchTopScorers,
    fetchTopAssists,
    fetchCleanSheets,
    fetchNews,
    fetchAllStatistics,
    toggleBookmark,
  }
})
