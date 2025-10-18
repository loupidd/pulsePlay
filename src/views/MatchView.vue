<template>
  <div class="relative">
    <transition name="slide-fade" mode="out-in">
      <!-- Match List -->
      <MatchResults v-if="!selectedMatch" @match-click="handleMatchClick" key="list" />

      <!-- Match Details -->
      <MatchDetails
        v-else-if="selectedMatch && !selectedClub"
        :match="selectedMatch"
        @back="selectedMatch = null"
        @view-club="handleClubClick"
        key="details"
      />

      <!-- Club Details (Full Screen) -->
      <ClubDetails
        v-else-if="selectedClub"
        :club="selectedClub"
        @back="handleBackFromClub"
        key="club"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MatchDetails from '../components/MatchDetails.vue'
import MatchResults from '@/components/MatchResults.vue'
import ClubDetails from '@/components/ClubDetails.vue'
import axios from 'axios'

// ----- TYPES -----
interface Team {
  id?: string | number
  name: string
  logo: string
  score: number
  lineup: string[]
}

interface MatchDetailsType {
  id: string
  competitions: string
  date: string
  homeTeam: Team
  awayTeam: Team
  stats: { label: string; home: string; away: string }[]
  goals?: { player: string; minute: string; team: 'home' | 'away'; icon: string }[]
  gradientFrom: string
  gradientTo: string
  isFavorite: boolean
}

type ClubDetailsType = InstanceType<typeof ClubDetails>['$props']['club']

// ----- STATE -----
const selectedMatch = ref<MatchDetailsType | null>(null)
const selectedClub = ref<ClubDetailsType | null>(null)
const isLoadingClub = ref(false)

// ----- HANDLERS -----
async function handleMatchClick(fixtureId: string) {
  selectedClub.value = null

  try {
    const response = await axios.get(`http://localhost:8080/api/match-details/${fixtureId}`)
    const data = response.data

    // Map backend JSON to MatchDetailsType
    selectedMatch.value = {
      id: data.id,
      competitions: data.competitions,
      date: new Date(data.date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }),
      homeTeam: {
        id: data.homeTeam.id,
        name: data.homeTeam.name,
        logo: data.homeTeam.logo,
        score: data.homeTeam.score,
        lineup: data.homeTeam.lineup || [],
      },
      awayTeam: {
        id: data.awayTeam.id,
        name: data.awayTeam.name,
        logo: data.awayTeam.logo,
        score: data.awayTeam.score,
        lineup: data.awayTeam.lineup || [],
      },
      stats: data.stats || [],
      goals: data.goals || [],
      gradientFrom: data.gradientFrom || '#1e1b4b',
      gradientTo: data.gradientTo || '#312e81',
      isFavorite: data.isFavorite || false,
    }
  } catch (error) {
    console.error('Error fetching match details:', error)
    alert('Failed to load match details. Please try again.')
  }
}

async function handleClubClick(team: Team) {
  if (isLoadingClub.value) return

  isLoadingClub.value = true

  try {
    // Extract team ID from team object or logo URL
    const teamId = team.id || extractTeamIdFromLogo(team.logo)

    if (!teamId) {
      console.error('No team ID available for:', team.name)
      // Fallback to basic data
      setBasicClubData(team)
      return
    }

    console.log('Fetching club details for team ID:', teamId)

    // Fetch real club data from your backend
    const response = await axios.get(`http://localhost:8080/api/clubs/${teamId}?season=2023`)
    const data = response.data

    // Map backend data to ClubDetailsType
    selectedClub.value = {
      name: data.name || team.name,
      logo: data.logo || team.logo,
      country: data.country || '',
      founded: data.founded || 0,
      venue: data.venue || '',
      venueCapacity: data.venueCapacity || 0,
      venueCity: data.venueCity || '',
      recentForm: data.recentForm || [],
      recentOpponents: data.recentOpponents || [],
      nextMatch: data.nextMatch || {
        competition: '',
        opponent: { name: '', logo: '' },
        time: '',
        date: '',
      },
      lineup:
        data.lineup ||
        team.lineup.map((playerName, index) => ({
          name: playerName,
          number: index + 1,
        })),
      competition: data.competition || '',
      upcomingFixtures: data.upcomingFixtures || [],
      standings: data.standings || [],
      statistics: data.statistics || undefined,
    } as ClubDetailsType

    console.log('Club details loaded successfully:', selectedClub.value.name)
  } catch (error) {
    console.error('Error fetching club details:', error)
    // Fallback to basic data if API fails
    setBasicClubData(team)
  } finally {
    isLoadingClub.value = false
  }
}

function setBasicClubData(team: Team) {
  selectedClub.value = {
    name: team.name,
    logo: team.logo,
    country: '',
    founded: 0,
    venue: '',
    venueCapacity: 0,
    venueCity: '',
    recentForm: [],
    recentOpponents: [],
    nextMatch: {
      competition: '',
      opponent: { name: '', logo: '' },
      time: '',
      date: '',
    },
    lineup: team.lineup.map((playerName, index) => ({
      name: playerName,
      number: index + 1,
    })),
    competition: '',
    upcomingFixtures: [],
    standings: [],
    statistics: undefined,
  } as ClubDetailsType
}

function handleBackFromClub() {
  console.log('Back from club details to match details')
  selectedClub.value = null
  // selectedMatch remains set, so it will show the match details again
}

// Helper function to extract team ID from logo URL
function extractTeamIdFromLogo(logoUrl: string): string | null {
  if (!logoUrl) return null

  // API-SPORTS format: https://media.api-sports.io/football/teams/33.png
  const match = logoUrl.match(/\/teams\/(\d+)\.png/)
  return match ? match[1] : null
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
