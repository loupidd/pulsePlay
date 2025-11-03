<template>
  <div class="news-page">
    <!-- Header Section -->
    <div class="news-header">
      <div class="header-content">
        <h1 class="page-title">Trending News</h1>
        <div class="header-actions">
          <div class="source-selector">
            <button
              v-for="source in sources"
              :key="source.id"
              @click="selectSource(source.id)"
              class="source-btn"
              :class="{ active: selectedSource === source.id }"
            >
              {{ source.name }}
            </button>
          </div>
          <button @click="refreshNews" class="refresh-btn" :disabled="loading">
            <svg
              class="refresh-icon"
              :class="{ spinning: loading }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && allNews.length === 0" class="news-grid">
      <div class="skeleton-card featured-skeleton" v-for="i in 1" :key="'featured-' + i"></div>
      <div class="skeleton-card" v-for="i in 8" :key="'skeleton-' + i"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
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
        <h3 class="error-title">Failed to load news</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="refreshNews" class="retry-btn">Try Again</button>
      </div>
    </div>

    <!-- News Grid -->
    <div v-else-if="allNews.length > 0" class="news-grid">
      <!-- Featured News (First Item - Large) -->
      <article
        v-if="featuredArticle"
        class="news-card featured"
        @click="openArticle(featuredArticle)"
      >
        <div class="card-image-wrapper">
          <img
            v-if="featuredArticle.image"
            :src="featuredArticle.image"
            :alt="featuredArticle.title"
            class="card-image"
            @error="handleImageError"
            loading="lazy"
          />
          <div class="image-overlay"></div>
          <div class="card-badge featured-badge">Featured</div>
        </div>
        <div class="card-content featured-content">
          <div class="card-meta">
            <span class="source-tag">{{ featuredArticle.source }}</span>
            <span class="date-text">{{ formatDate(featuredArticle.date) }}</span>
          </div>
          <h2 class="card-title featured-title">{{ featuredArticle.title }}</h2>
          <p v-if="featuredArticle.description" class="card-description">
            {{ truncateText(featuredArticle.description, 150) }}
          </p>
          <div class="card-actions">
            <button
              @click.stop="toggleBookmark(featuredArticle.id)"
              class="bookmark-btn"
              :class="{ bookmarked: bookmarkedIds.has(featuredArticle.id) }"
            >
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  :fill="bookmarkedIds.has(featuredArticle.id) ? 'currentColor' : 'none'"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>

      <!-- Regular News Cards -->
      <article
        v-for="article in regularArticles"
        :key="article.id"
        class="news-card"
        @click="openArticle(article)"
      >
        <div class="card-image-wrapper">
          <img
            v-if="article.image"
            :src="article.image"
            :alt="article.title"
            class="card-image"
            @error="handleImageError"
            loading="lazy"
          />
          <div class="image-overlay"></div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="source-tag">{{ article.source }}</span>
            <span class="date-text">{{ formatDate(article.date) }}</span>
          </div>
          <h3 class="card-title">{{ article.title }}</h3>
          <p v-if="article.description" class="card-description">
            {{ truncateText(article.description, 100) }}
          </p>
          <div class="card-actions">
            <button
              @click.stop="toggleBookmark(article.id)"
              class="bookmark-btn"
              :class="{ bookmarked: bookmarkedIds.has(article.id) }"
            >
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  :fill="bookmarkedIds.has(article.id) ? 'currentColor' : 'none'"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-container">
      <div class="empty-content">
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
        <h3 class="empty-title">No news available</h3>
        <p class="empty-message">Check back later for the latest football news</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// This component should be saved as: src/views/NewsView.vue

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  image: string
  source: string
  date: string
  publishedAt: string
  isBookmarked: boolean
}

interface NewsSource {
  id: string
  name: string
}

const API_BASE_URL = 'http://localhost:8080/api'

const allNews = ref<NewsArticle[]>([])
const sources = ref<NewsSource[]>([
  { id: 'espn', name: 'ESPN' },
  { id: 'bbc', name: 'BBC Sport' },
  { id: 'sky-sports', name: 'Sky Sports' },
  { id: 'goal', name: 'Goal.com' },
  { id: 'the-athletic', name: 'The Athletic' },
])
const selectedSource = ref('espn')
const loading = ref(false)
const error = ref<string | null>(null)
const bookmarkedIds = ref<Set<string>>(new Set())

const featuredArticle = computed(() => allNews.value[0] || null)
const regularArticles = computed(() => allNews.value.slice(1))

const fetchNews = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get<NewsArticle[]>(`${API_BASE_URL}/news/trending`, {
      params: {
        source: selectedSource.value,
        limit: 20,
      },
    })

    allNews.value = response.data.map((article) => ({
      ...article,
      isBookmarked: bookmarkedIds.value.has(article.id),
    }))
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = 'Unable to load news. Please try again later.'
  } finally {
    loading.value = false
  }
}

const selectSource = async (sourceId: string) => {
  if (selectedSource.value === sourceId) return
  selectedSource.value = sourceId
  await fetchNews()
}

const refreshNews = async () => {
  await fetchNews()
}

const openArticle = (article: NewsArticle) => {
  if (article.url) {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }
}

const toggleBookmark = (articleId: string) => {
  if (bookmarkedIds.value.has(articleId)) {
    bookmarkedIds.value.delete(articleId)
  } else {
    bookmarkedIds.value.add(articleId)
  }

  // Update the article in the list
  const article = allNews.value.find((a) => a.id === articleId)
  if (article) {
    article.isBookmarked = bookmarkedIds.value.has(articleId)
  }

  // Persist to localStorage
  localStorage.setItem('bookmarkedNews', JSON.stringify([...bookmarkedIds.value]))
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Just now'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks}w ago`
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return 'Just now'
  }
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/800x450/1a1f37/6b7280?text=No+Image'
}

onMounted(() => {
  // Load bookmarked articles from localStorage
  const saved = localStorage.getItem('bookmarkedNews')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      bookmarkedIds.value = new Set(parsed)
    } catch (e) {
      console.error('Error loading bookmarks:', e)
    }
  }

  fetchNews()
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f37 100%);
  padding: 2rem;
}

/* Header */
.news-header {
  margin-bottom: 2.5rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.025em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.source-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.source-btn {
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.source-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.source-btn.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.refresh-btn {
  padding: 0.625rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* News Grid */
.news-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Featured Card (spans 2 columns on larger screens) */
.news-card.featured {
  grid-column: span 2;
  min-height: 450px;
}

@media (max-width: 768px) {
  .news-card.featured {
    grid-column: span 1;
  }
}

/* News Card */
.news-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.15);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: linear-gradient(135deg, #1a1f37 0%, #0f1419 100%);
}

.news-card.featured .card-image-wrapper {
  padding-top: 50%;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(15, 20, 25, 0.3) 50%,
    rgba(15, 20, 25, 0.8) 100%
  );
}

.card-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.875rem;
  background: rgba(239, 68, 68, 0.95);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.featured-content {
  padding: 1.5rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.source-tag {
  padding: 0.25rem 0.625rem;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.date-text {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-title {
  font-size: 1.75rem;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  font-weight: 700;
  line-height: 1.3;
}

.card-description {
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured .card-description {
  font-size: 1rem;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.bookmark-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ef4444;
}

.bookmark-btn.bookmarked {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.bookmark-btn .icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Loading Skeleton */
.skeleton-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  height: 350px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.featured-skeleton {
  grid-column: span 2;
  height: 450px;
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

/* Error State */
.error-container,
.empty-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.error-content,
.empty-content {
  text-align: center;
  max-width: 400px;
}

.error-icon,
.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: #64748b;
}

.error-icon svg,
.empty-icon svg {
  width: 100%;
  height: 100%;
}

.error-title,
.empty-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.error-message,
.empty-message {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 0.75rem;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* Responsive */
@media (max-width: 1200px) {
  .news-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 1024px) {
  .news-page {
    padding: 1.5rem;
  }

  .header-content {
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }

  .news-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .news-card.featured {
    min-height: 400px;
  }

  .featured-title {
    font-size: 1.625rem;
  }
}

@media (max-width: 768px) {
  .news-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.875rem;
    margin-bottom: 1rem;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .source-selector {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.25rem;
  }

  .source-selector::-webkit-scrollbar {
    display: none;
  }

  .source-btn {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .refresh-btn {
    align-self: flex-end;
    width: fit-content;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .news-card.featured {
    grid-column: span 1;
    min-height: 350px;
  }

  .card-image-wrapper {
    padding-top: 60%;
  }

  .news-card.featured .card-image-wrapper {
    padding-top: 55%;
  }

  .featured-title {
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 0.9375rem;
  }

  .card-description {
    font-size: 0.8125rem;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .featured .card-description {
    font-size: 0.9375rem;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .card-content {
    padding: 1rem;
  }

  .featured-content {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .news-page {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 1.625rem;
    margin-bottom: 0.875rem;
  }

  .source-btn {
    padding: 0.4375rem 0.875rem;
    font-size: 0.75rem;
  }

  .refresh-btn {
    padding: 0.5rem;
  }

  .refresh-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  .news-grid {
    gap: 0.875rem;
  }

  .news-card.featured {
    min-height: 320px;
  }

  .card-badge {
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.3125rem 0.75rem;
    font-size: 0.6875rem;
  }

  .featured-title {
    font-size: 1.375rem;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .card-title {
    font-size: 0.875rem;
  }

  .card-meta {
    gap: 0.5rem;
  }

  .source-tag {
    padding: 0.1875rem 0.5rem;
    font-size: 0.6875rem;
  }

  .date-text {
    font-size: 0.6875rem;
  }

  .card-description {
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .card-content {
    padding: 0.875rem;
    gap: 0.625rem;
  }

  .featured-content {
    padding: 1rem;
  }

  .bookmark-btn .icon {
    width: 1rem;
    height: 1rem;
  }

  .error-icon,
  .empty-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }

  .error-title,
  .empty-title {
    font-size: 1.25rem;
  }

  .error-message,
  .empty-message {
    font-size: 0.875rem;
  }

  .retry-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 360px) {
  .news-page {
    padding: 0.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .source-btn {
    padding: 0.375rem 0.75rem;
  }

  .news-card.featured {
    min-height: 280px;
  }

  .featured-title {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 0.8125rem;
  }
}

/* Touch improvements for mobile */
@media (hover: none) and (pointer: coarse) {
  .news-card {
    transition: transform 0.2s ease;
  }

  .news-card:active {
    transform: scale(0.98);
  }

  .source-btn:active {
    transform: scale(0.95);
  }

  .refresh-btn:active {
    transform: scale(0.95);
  }

  .bookmark-btn:active {
    transform: scale(0.9);
  }

  /* Larger touch targets on mobile */
  .bookmark-btn {
    padding: 0.625rem;
  }

  .refresh-btn {
    padding: 0.75rem;
  }
}
</style>
