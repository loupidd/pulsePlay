<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppBanner from '../components/AppBanner.vue'
import NewsStatistics from '../components/NewsStatistics.vue'
import MatchView from './MatchView.vue'
import CompetitionsFilter from '../components/CompetitionsFilter.vue'

const isMobile = ref(false)
const showFilters = ref(false)
const showNews = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    showFilters.value = false
    showNews.value = false
  }
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
  if (showFilters.value) showNews.value = false
}

const toggleNews = () => {
  showNews.value = !showNews.value
  if (showNews.value) showFilters.value = false
}

const closeAllPanels = () => {
  showFilters.value = false
  showNews.value = false
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="dashboard-container">
    <div v-if="isMobile" class="mobile-controls">
      <button @click="toggleFilters" class="control-btn" :class="{ active: showFilters }">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filters</span>
      </button>
      <button @click="toggleNews" class="control-btn" :class="{ active: showNews }">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <span>News</span>
      </button>
    </div>

    <div class="dashboard-layout">
      <aside class="sidebar filters-sidebar" :class="{ 'mobile-open': isMobile && showFilters }">
        <div v-if="isMobile" class="mobile-header">
          <h3 class="mobile-title">Filters</h3>
          <button @click="showFilters = false" class="close-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <CompetitionsFilter class="filter-content" />
      </aside>

      <main class="main-content">
        <AppBanner class="banner-section" />
        <MatchView class="match-section" />
      </main>

      <aside class="sidebar news-sidebar" :class="{ 'mobile-open': isMobile && showNews }">
        <div v-if="isMobile" class="mobile-header">
          <h3 class="mobile-title">Trending News</h3>
          <button @click="showNews = false" class="close-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <NewsStatistics class="news-content" />
      </aside>
    </div>

    <div
      v-if="isMobile && (showFilters || showNews)"
      class="mobile-overlay"
      @click="closeAllPanels"
    ></div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  position: relative;
}

.mobile-controls {
  display: none;
  position: sticky;
  top: 80px;
  z-index: 40;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 0.75rem;
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.control-btn.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.control-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.dashboard-layout {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  max-width: 1600px;
  margin: 0 auto;
}

.sidebar {
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.filters-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 5rem;
  height: fit-content;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
}

.news-sidebar {
  width: 380px;
  flex-shrink: 0;
  position: sticky;
  top: 5rem;
  height: fit-content;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
}

.filter-content,
.news-content {
  height: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.banner-section {
  width: 100%;
  height: 240px;
  min-height: 240px;
}

.match-section {
  width: 100%;
  flex: 1;
}

.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.close-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 45;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (min-width: 1440px) {
  .dashboard-layout {
    max-width: 1600px;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .filters-sidebar {
    width: 260px;
  }

  .news-sidebar {
    width: 400px;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .dashboard-layout {
    max-width: 1400px;
  }

  .filters-sidebar {
    width: 220px;
  }

  .news-sidebar {
    width: 360px;
  }
}

@media (max-width: 1023px) {
  .mobile-controls {
    display: flex;
  }

  .dashboard-layout {
    padding: 0.75rem;
  }

  .filters-sidebar,
  .news-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 320px;
    max-width: 85vw;
    height: 100vh;
    max-height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    border-radius: 0;
    padding: 1.5rem;
  }

  .filters-sidebar {
    left: 0;
  }

  .news-sidebar {
    right: 0;
    left: auto;
    transform: translateX(100%);
  }

  .filters-sidebar.mobile-open {
    transform: translateX(0);
  }

  .news-sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-header {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .main-content {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .dashboard-layout {
    padding: 0.5rem;
  }

  .mobile-controls {
    padding: 0.625rem 0.75rem;
    gap: 0.5rem;
  }

  .control-btn {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }

  .control-btn .icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  .filters-sidebar,
  .news-sidebar {
    width: 100%;
    max-width: 100vw;
    padding: 1.25rem;
  }

  .main-content {
    gap: 0.75rem;
  }
}

@media (max-width: 479px) {
  .dashboard-layout {
    padding: 0.5rem;
  }

  .mobile-controls {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .control-btn {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }

  .control-btn .icon {
    width: 1rem;
    height: 1rem;
  }

  .filters-sidebar,
  .news-sidebar {
    padding: 1rem;
  }

  .mobile-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 896px) and (orientation: landscape) {
  .mobile-controls {
    top: 56px;
  }

  .filters-sidebar,
  .news-sidebar {
    overflow-y: auto;
  }
}

@media (hover: none) and (pointer: coarse) {
  .control-btn:active {
    transform: scale(0.96);
  }

  .close-btn:active {
    transform: scale(0.9);
  }

  .filters-sidebar,
  .news-sidebar {
    -webkit-overflow-scrolling: touch;
  }
}

.filters-sidebar::-webkit-scrollbar,
.news-sidebar::-webkit-scrollbar {
  width: 6px;
}

.filters-sidebar::-webkit-scrollbar-track,
.news-sidebar::-webkit-scrollbar-track {
  border-radius: 3px;
}

.filters-sidebar::-webkit-scrollbar-thumb,
.news-sidebar::-webkit-scrollbar-thumb {
  border-radius: 3px;
}

.filters-sidebar::-webkit-scrollbar-thumb:hover,
.news-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
