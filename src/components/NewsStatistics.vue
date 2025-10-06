<template>
  <div class="space-y-6">
    <!-- Trending News Section -->
    <div
      class="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl shadow-lg overflow-hidden"
    >
      <!-- Header -->
      <div class="p-6 pb-4">
        <h2 class="text-white font-bold text-xl">Trending News</h2>
      </div>

      <!-- Featured News (Large Card) -->
      <div
        v-if="featuredNews"
        class="relative mx-6 mb-4 rounded-xl overflow-hidden cursor-pointer group"
        @click="handleNewsClick(featuredNews.id)"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            :src="featuredNews.image"
            :alt="featuredNews.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          ></div>

          <!-- Content Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-base mb-2 line-clamp-2">
              {{ featuredNews.title }}
            </h3>
            <p class="text-gray-300 text-xs">
              {{ featuredNews.date }}
            </p>
          </div>
        </div>
      </div>

      <!-- News List -->
      <div class="px-6 pb-6 space-y-3">
        <div
          v-for="news in newsList"
          :key="news.id"
          class="flex gap-3 cursor-pointer group"
          @click="handleNewsClick(news.id)"
        >
          <!-- Thumbnail -->
          <div class="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              :src="news.image"
              :alt="news.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4
              class="text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-gray-300 transition-colors"
            >
              {{ news.title }}
            </h4>
            <p class="text-gray-400 text-xs">
              {{ news.date }}
            </p>
          </div>

          <!-- Bookmark Icon -->
          <button
            @click.stop="handleBookmark(news.id)"
            class="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  news.isBookmarked
                    ? 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                    : 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                "
                :fill="news.isBookmarked ? 'currentColor' : 'none'"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div
      class="bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 rounded-2xl shadow-lg p-6"
    >
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-white font-bold text-xl mb-4">Top Scorers</h2>

        <!-- League Selector -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="league in leagues"
            :key="league.id"
            @click="selectedLeague = league.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0',
              selectedLeague === league.id
                ? 'bg-white text-gray-900'
                : 'bg-white/10 text-white hover:bg-white/20',
            ]"
          >
            {{ league.name }}
          </button>
        </div>
      </div>

      <!-- Top Scorers List -->
      <div class="space-y-3">
        <div
          v-for="(player, index) in topScorers"
          :key="player.id"
          class="player-card flex items-center gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer"
          @click="handlePlayerClick(player.id)"
        >
          <!-- Rank -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
          </div>

          <!-- Player Image -->
          <div class="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
            <img :src="player.image" :alt="player.name" class="w-full h-full object-cover" />
          </div>

          <!-- Player Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-white text-sm font-semibold truncate">{{ player.name }}</h4>
            <div class="flex items-center gap-2 mt-0.5">
              <img :src="player.team.logo" :alt="player.team.name" class="w-4 h-4 object-contain" />
              <span class="text-gray-400 text-xs truncate">{{ player.team.name }}</span>
            </div>
          </div>

          <!-- Goals -->
          <div class="flex-shrink-0 text-right">
            <div class="text-white font-bold text-lg">{{ player.goals }}</div>
            <div class="text-gray-400 text-xs">goals</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface News {
  id: string
  title: string
  date: string
  image: string
  isBookmarked: boolean
}

interface Team {
  name: string
  logo: string
}

interface Player {
  id: string
  name: string
  image: string
  team: Team
  goals: number
  leagueId: string
}

interface League {
  id: string
  name: string
}

// Featured news (large card)
const featuredNews = ref<News>({
  id: 'featured-1',
  title: 'Kick OFF Times',
  date: 'Man United 2 / La Liga',
  image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  isBookmarked: false,
})

// News list
const newsList = ref<News[]>([
  {
    id: '1',
    title: "Real Sociedad 1-4 FC Barcelona: It's all starting to Click!",
    date: 'Aug 21 2025 16h',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'The sequel for this trip to Camp Nou for Barcelona - Atlético',
    date: '29 AUG 2025 14:16',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'Carlo Ancelotti in the running to be named UEFA Coach of...',
    date: '29 AUG 2025 14:16',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80',
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'FC Barcelona leads in Golden Bye 2025 candidates...',
    date: '29 AUG 2025 14:54',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Mohamed Salah can set Liverpool scoring record v Man Utd',
    date: '29 AUG 2025 14:54',
    image:
      'https://backend.liverpoolfc.com/sites/default/files/styles/lg/public/acquiadam/2022-08/mohamed-salah-liverpool-fc-man-utd-190822.webp?itok=fSFARayz&width=1680',
    isBookmarked: false,
  },
])

// Leagues
const leagues = ref<League[]>([
  { id: 'laliga', name: 'La Liga' },
  { id: 'epl', name: 'Premier League' },
  { id: 'seriea', name: 'Serie A' },
  { id: 'bundesliga', name: 'Bundesliga' },
])

const selectedLeague = ref('laliga')

// Top scorers data
const allPlayers = ref<Player[]>([
  {
    id: '1',
    name: 'Robert Lewandowski',
    image: 'https://img.a.transfermarkt.technology/portrait/header/38253-1701118759.jpg?lm=1',
    team: {
      name: 'FC Barcelona',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/131.png?lm=1406739548',
    },
    goals: 24,
    leagueId: 'laliga',
  },
  {
    id: '2',
    name: 'Jude Bellingham',
    image: 'https://img.a.transfermarkt.technology/portrait/header/581678-1748102891.jpg?lm=1',
    team: {
      name: 'Real Madrid',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/418.png?lm=1729684474',
    },
    goals: 22,
    leagueId: 'laliga',
  },
  {
    id: '3',
    name: 'Antoine Griezmann',
    image: 'https://img.a.transfermarkt.technology/portrait/header/125781-1719928503.jpg?lm=1',
    team: {
      name: 'Atlético Madrid',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/13.png?lm=1719915566',
    },
    goals: 18,
    leagueId: 'laliga',
  },
  {
    id: '4',
    name: 'Álvaro Morata',
    image: 'https://img.a.transfermarkt.technology/portrait/header/128223-1719989301.jpg?lm=1',
    team: {
      name: 'Como FC',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/1047.png?lm=1565704078',
    },
    goals: 17,
    leagueId: 'seriea',
  },
  {
    id: '5',
    name: 'Erling Haaland',
    image: 'https://img.a.transfermarkt.technology/portrait/header/418560-1709108116.png?lm=1',
    team: {
      name: 'Manchester City',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/281.png?lm=1467356331',
    },
    goals: 28,
    leagueId: 'epl',
  },
  {
    id: '6',
    name: 'Kevin Diks',
    image:
      'https://tmssl.akamaized.net/images/foto/galerie/kevin-diks-borussia-monchengladbach-2025-1756991653-176747.jpg',
    team: {
      name: 'Borussia Mönchengladbach',
      logo: 'https://tmssl.akamaized.net//images/wappen/homepageWappen150x150/18.png?lm=1656585796',
    },
    goals: 1,
    leagueId: 'bundesliga',
  },
])

const topScorers = computed(() => {
  return allPlayers.value
    .filter((player) => player.leagueId === selectedLeague.value)
    .sort((a, b) => b.goals - a.goals)
})

const emit = defineEmits<{
  newsClick: [newsId: string]
  playerClick: [playerId: string]
  bookmarkToggle: [newsId: string]
}>()

const handleNewsClick = (newsId: string) => {
  emit('newsClick', newsId)
}

const handlePlayerClick = (playerId: string) => {
  emit('playerClick', playerId)
}

const handleBookmark = (newsId: string) => {
  const news = newsList.value.find((n) => n.id === newsId)
  if (news) {
    news.isBookmarked = !news.isBookmarked
    emit('bookmarkToggle', newsId)
  }
}
</script>

<style scoped>
/* Hide scrollbar for league selector */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.player-card img {
  transition: transform 0.3s;
}
.player-card:hover img {
  transform: scale(1.05);
}
.player-card {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
