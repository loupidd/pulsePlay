<template>
  <div class="relative">
    <transition name="slide-fade" mode="out-in">
      <!-- Match List -->
      <MatchResults v-if="!selectedMatch" @match-click="handleMatchClick" key="list" />

      <!-- Match Details -->
      <MatchDetails
        v-else-if="selectedMatch"
        :match="selectedMatch"
        @back="selectedMatch = null"
        @view-club="handleClubClick"
        key="details"
      />
    </transition>

    <!-- Club Details Overlay -->
    <transition name="fade">
      <ClubDetails
        v-if="selectedClub"
        :club="selectedClub"
        class="absolute top-4 right-4 z-50"
        @close="selectedClub = null"
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

// ----- HANDLERS -----
async function handleMatchClick(fixtureId: string) {
  selectedClub.value = null

  try {
    const response = await axios.get(`http://localhost:8080/api/match-details/${fixtureId}`)
    const data = response.data

    // Map backend JSON to MatchDetailsType (matching your backend structure)
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
        name: data.homeTeam.name,
        logo: data.homeTeam.logo,
        score: data.homeTeam.score,
        lineup: data.homeTeam.lineup || [],
      },
      awayTeam: {
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

function handleClubClick(team: Team) {
  selectedClub.value = {
    name: team.name,
    logo: team.logo,
    fifaRank: 0,
    highestRank: { rank: 0, date: '' },
    recentForm: [],
    recentOpponents: [],
    upcomingFixtures: [],
    nextMatch: {
      competition: '',
      opponent: { name: '', logo: '' },
      time: '',
      date: '',
    },
    lineup: team.lineup.map((playerName, index) => ({ name: playerName, number: index + 1 })),
    competition: '',
    group: '',
    standings: [],
  } as unknown as ClubDetailsType
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
