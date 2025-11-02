<template>
  <div class="statistics-container">
    <!-- Trending News Section -->
    <div class="news-section">
      <!-- Header -->
      <div class="section-header">
        <h2 class="section-title">Trending News</h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !featuredNews" class="news-content">
        <div class="loading-skeleton">
          <div class="skeleton-featured"></div>
          <div class="skeleton-list">
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
          </div>
        </div>
      </div>

      <!-- Featured News (Large Card) -->
      <div v-else-if="featuredNews" class="news-content">
        <div class="featured-news" @click="handleNewsClick(featuredNews.id)">
          <div class="featured-image-wrapper">
            <img
              v-if="featuredNews.image"
              :src="featuredNews.image"
              :alt="featuredNews.title"
              class="featured-image"
              @error="handleImageError"
            />
            <div class="featured-overlay"></div>
            <div class="featured-content">
              <h3 class="featured-title">{{ featuredNews.title }}</h3>
              <p class="featured-date">{{ formatDate(featuredNews.date) }}</p>
            </div>
          </div>
        </div>

        <!-- News List -->
        <div class="news-list">
          <div
            v-for="newsItem in news"
            :key="newsItem.id"
            class="news-item"
            @click="handleNewsClick(newsItem.id)"
          >
            <div class="news-thumbnail">
              <img
                v-if="newsItem.image"
                :src="newsItem.image"
                :alt="newsItem.title"
                class="thumbnail-image"
                @error="handleImageError"
              />
            </div>
            <div class="news-info">
              <h4 class="news-title">{{ newsItem.title }}</h4>
              <p class="news-date">{{ formatDate(newsItem.date) }}</p>
            </div>
            <button
              @click.stop="handleBookmark(newsItem.id)"
              class="bookmark-btn"
              :class="{ bookmarked: newsItem.isBookmarked }"
            >
              <svg class="bookmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  :fill="newsItem.isBookmarked ? 'currentColor' : 'none'"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <p class="empty-text">No news available</p>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="stats-section">
      <!-- Header -->
      <div class="section-header">
        <h2 class="section-title">Player Statistics</h2>

        <!-- League Selector -->
        <div class="league-selector">
          <button
            v-for="league in availableLeagues"
            :key="league.id"
            @click="selectLeague(league.id, league.season)"
            class="league-btn"
            :class="{ active: selectedLeagueId === league.id }"
          >
            {{ league.name }}
          </button>
        </div>

        <!-- Stats Tabs -->
        <div class="stats-tabs">
          <button
            @click="selectedTab = 'scorers'"
            class="tab-btn"
            :class="{ active: selectedTab === 'scorers' }"
          >
            Top Scorers
          </button>
          <button
            @click="selectedTab = 'assists'"
            class="tab-btn"
            :class="{ active: selectedTab === 'assists' }"
          >
            Top Assists
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="stats-content">
        <div class="loading-skeleton">
          <div class="skeleton-stat" v-for="i in 5" :key="i"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p class="error-text">{{ error }}</p>
        <button @click="loadStatistics" class="retry-btn">Try Again</button>
      </div>

      <!-- Top Scorers List -->
      <div v-else-if="selectedTab === 'scorers' && topScorers.length > 0" class="stats-content">
        <div class="stats-list">
          <div
            v-for="(player, index) in topScorers"
            :key="player.id"
            class="stat-item"
            @click="handlePlayerClick(player.id)"
          >
            <div class="rank-badge">{{ index + 1 }}</div>
            <div class="player-avatar">
              <img :src="player.image" :alt="player.name" @error="handleImageError" />
            </div>
            <div class="player-info">
              <h4 class="player-name">{{ player.name }}</h4>
              <div class="team-info">
                <img
                  :src="player.team.logo"
                  :alt="player.team.name"
                  class="team-logo"
                  @error="handleImageError"
                />
                <span class="team-name">{{ player.team.name }}</span>
              </div>
            </div>
            <div class="stat-value">
              <div class="stat-number">{{ player.goals }}</div>
              <div class="stat-label">goals</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Assists List -->
      <div v-else-if="selectedTab === 'assists' && topAssists.length > 0" class="stats-content">
        <div class="stats-list">
          <div
            v-for="(player, index) in topAssists"
            :key="player.id"
            class="stat-item"
            @click="handlePlayerClick(player.id)"
          >
            <div class="rank-badge">{{ index + 1 }}</div>
            <div class="player-avatar">
              <img :src="player.image" :alt="player.name" @error="handleImageError" />
            </div>
            <div class="player-info">
              <h4 class="player-name">{{ player.name }}</h4>
              <div class="team-info">
                <img
                  :src="player.team.logo"
                  :alt="player.team.name"
                  class="team-logo"
                  @error="handleImageError"
                />
                <span class="team-name">{{ player.team.name }}</span>
              </div>
            </div>
            <div class="stat-value">
              <div class="stat-number">{{ player.assists }}</div>
              <div class="stat-label">assists</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p class="empty-text">No data available for this league</p>
        <p class="empty-subtext">Please check if the backend is running or try another league</p>
        <button @click="loadStatistics" class="retry-btn">Refresh Data</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { storeToRefs } from 'pinia'

const statisticsStore = useStatisticsStore()
const { topScorers, topAssists, news, featuredNews, availableLeagues, loading, error } =
  storeToRefs(statisticsStore)

const selectedLeagueId = ref(39)
const selectedSeason = ref('2023')
const selectedTab = ref<'scorers' | 'assists'>('scorers')

const emit = defineEmits<{
  newsClick: [newsId: string]
  playerClick: [playerId: number]
}>()

const selectLeague = async (leagueId: number, season: string) => {
  selectedLeagueId.value = leagueId
  selectedSeason.value = season
  await loadStatistics()
}

const loadStatistics = async () => {
  await statisticsStore.fetchAllStatistics(selectedLeagueId.value, selectedSeason.value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Recently'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}

const handleNewsClick = (newsId: string) => {
  // Find the news item
  const newsItem = news.value.find((n) => n.id === newsId) || featuredNews.value

  if (newsItem && newsItem.url) {
    // Open the real news URL in a new tab
    window.open(newsItem.url, '_blank')
  }

  emit('newsClick', newsId)
}

const handlePlayerClick = (playerId: number) => {
  emit('playerClick', playerId)
}

const handleBookmark = (newsId: string) => {
  statisticsStore.toggleBookmark(newsId)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/150/1a1f37/6b7280?text=No+Image'
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.statistics-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* News Section */
.news-section {
  background: #1a1f37;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-header {
  padding: 24px 24px 16px 24px;
}

.section-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.news-content {
  padding: 0 24px 24px 24px;
}

/* Featured News */
.featured-news {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 16px;
}

.featured-image-wrapper {
  position: relative;
  height: 208px;
  background: rgba(255, 255, 255, 0.05);
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.featured-news:hover .featured-image {
  transform: scale(1.05);
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
}

.featured-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
}

.featured-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-date {
  color: #d1d5db;
  font-size: 14px;
  margin: 0;
}

/* News List */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.news-thumbnail {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-item:hover .thumbnail-image {
  transform: scale(1.05);
}

.news-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.news-title {
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  color: #6b7280;
  font-size: 12px;
  margin: 0;
}

.bookmark-btn {
  flex-shrink: 0;
  padding: 4px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
}

.bookmark-btn:hover {
  color: #9ca3af;
}

.bookmark-btn.bookmarked {
  color: #ef4444;
}

.bookmark-icon {
  width: 20px;
  height: 20px;
}

/* Stats Section */
.stats-section {
  background: #1a1f37;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stats-section .section-header {
  padding: 0 0 24px 0;
}

.league-selector {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 16px;
  scrollbar-width: none;
}

.league-selector::-webkit-scrollbar {
  display: none;
}

.league-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

.league-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.league-btn.active {
  background: white;
  color: #111827;
}

.stats-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.tab-btn {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #6b7280;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

.tab-btn.active {
  background: #2d3250;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-content {
  margin-top: 24px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.player-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.team-name {
  color: #6b7280;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-value {
  text-align: right;
  flex-shrink: 0;
}

.stat-number {
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  color: #6b7280;
  font-size: 12px;
}

/* Loading Skeleton */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-featured {
  height: 208px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  height: 64px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-stat {
  height: 64px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: 8px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Empty State */
.empty-state,
.error-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon,
.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #6b7280;
}

.error-icon {
  background: rgba(239, 68, 68, 0.1);
}

.error-icon svg {
  width: 32px;
  height: 32px;
  color: #ef4444;
}

.empty-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.empty-subtext {
  color: #4b5563;
  font-size: 12px;
  margin: 0 0 16px 0;
}

.error-text {
  color: #ef4444;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.retry-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
