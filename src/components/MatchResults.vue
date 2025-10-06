<template>
  <div class="space-y-4">
    <!-- Match Card -->
    <div
      v-for="match in matches"
      :key="match.id"
      class="main-card relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl my-4"
      :style="{
        background: `linear-gradient(135deg, ${match.gradientFrom} 0%, ${match.gradientTo} 100%)`,
      }"
    >
      <!-- Content -->
      <div class="relative p-6 my-4">
        <!-- Header with League Info -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 overflow-hidden flex items-center justify-center">
              <img
                :src="match.league.logo"
                :alt="match.league.name"
                class="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h3 class="text-white font-bold text-sm">{{ match.league.country }}</h3>
              <p class="text-white/80 text-xs">{{ match.league.name }}</p>
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
            v-for="game in match.games"
            :key="game.id"
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
              <span class="text-white text-sm font-medium truncate">{{ game.homeTeam.name }}</span>
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
              <span class="text-white text-sm font-medium truncate text-right">{{
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
import { ref } from 'vue'

interface Team {
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

// Sample data
const matches = ref<Match[]>([
  {
    id: '1',
    league: {
      name: 'La Liga',
      country: 'Spain',
      logo: 'https://tmssl.akamaized.net//images/logo/homepageWappen150x150/es1.png?lm=1725974302',
    },
    gradientFrom: '#1e1b4b',
    gradientTo: '#312e81',
    isFavorite: false,
    games: [
      {
        id: '1-1',
        homeTeam: {
          name: 'Real Madrid',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/418.png?lm=1729684474',
          score: 3,
        },
        awayTeam: {
          name: 'Barcelona',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/131.png?lm=1406739548',
          score: 2,
        },
      },
      {
        id: '1-2',
        homeTeam: {
          name: 'Atletico Madrid',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/13.png?lm=1719915566',
          score: 1,
        },
        awayTeam: {
          name: 'Sevilla',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/368.png?lm=1730896593',
          score: 1,
        },
      },
      {
        id: '1-3',
        homeTeam: {
          name: 'Real Sociedad',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/681.png?lm=1614795530',
          score: 2,
        },
        awayTeam: {
          name: 'Valencia',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/1049.png?lm=1406966320',
          score: 0,
        },
      },
    ],
  },
  {
    id: '2',
    league: {
      name: 'Serie A',
      country: 'Italy',
      logo: 'https://tmssl.akamaized.net//images/logo/header/it1.png?lm=1656073460',
    },
    gradientFrom: '#064e3b',
    gradientTo: '#0f766e',
    isFavorite: true,
    games: [
      {
        id: '2-1',
        homeTeam: {
          name: 'Inter Milan',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/46.png?lm=1618900989',
          score: 2,
        },
        awayTeam: {
          name: 'AC Milan',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/5.png?lm=1605166627',
          score: 1,
        },
      },
      {
        id: '2-2',
        homeTeam: {
          name: 'Juventus',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/506.png?lm=1626441487',
          score: 3,
        },
        awayTeam: {
          name: 'Roma',
          logo: 'https://tmssl.akamaized.net//images/wappen/head/12.png?lm=1751979202',
          score: 2,
        },
      },
    ],
  },
])

const emit = defineEmits<{
  matchClick: [matchId: string]
  favoriteToggle: [matchId: string]
}>()

const handleMatchClick = (matchId: string) => {
  emit('matchClick', matchId)
}

const handleFavorite = (matchId: string) => {
  const match = matches.value.find((m) => m.id === matchId)
  if (match) {
    match.isFavorite = !match.isFavorite
    emit('favoriteToggle', matchId)
  }
}
</script>

<style>
.main-card {
  margin-bottom: 12px;
  margin-top: 12px;
}
</style>
