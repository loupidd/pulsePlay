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
        @club-click="handleClubClick"
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
  gradientFrom: string
  gradientTo: string
  isFavorite: boolean
}

// Extract the correct prop type from ClubDetails
type ClubDetailsType = InstanceType<typeof ClubDetails>['$props']['club']

// ----- STATE -----
const selectedMatch = ref<MatchDetailsType | null>(null)
const selectedClub = ref<ClubDetailsType | null>(null)

// ----- HANDLERS -----
function handleMatchClick(matchId: string) {
  selectedClub.value = null // reset any open club
  selectedMatch.value = {
    id: matchId,
    competitions: 'Serie A',
    date: 'October 6, 2025',
    homeTeam: {
      name: 'AC Milan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_AC_Milan.svg',
      score: 3,
      lineup: ['Leão', 'Rafael Leão', 'Benzema', 'Kaká', 'Ibrahimović'],
    },
    awayTeam: {
      name: 'Inter Milan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Inter_Milan_2021.svg',
      score: 2,
      lineup: ['Lukaku', 'Džeko', 'Martínez', 'Brozović', 'De Vrij'],
    },
    stats: [
      { label: 'Possession', home: '60%', away: '40%' },
      { label: 'Shots on Target', home: '8', away: '4' },
      { label: 'Fouls', home: '10', away: '15' },
      { label: 'Corners', home: '7', away: '3' },
    ],
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-800',
    isFavorite: false,
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
  } as unknown as ClubDetailsType // Type assertion to bypass incomplete data
}
</script>
