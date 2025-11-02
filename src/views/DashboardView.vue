<script lang="ts">
import AppBanner from '../components/AppBanner.vue'
import NewsStatistics from '..//components/NewsStatistics.vue'
import MatchView from './MatchView.vue'
import CompetitionsFilter from '../components/CompetitionsFilter.vue'

export default {
  name: 'DashboardView',
  components: {
    AppBanner,
    CompetitionsFilter,
    MatchView,
    NewsStatistics,
  },
}
</script>

<template>
  <div class="flex gap-4 p-4 min-h-screen">
    <CompetitionsFilter
      id="sidebar"
      class="self-start w-48 top-4 flex-shrink-0 sticky rounded-2xl p-4 h-[calc(100vh-2rem)] shadow-lg"
    />
    <div class="col-span-1 md:col-span-2 lg:col-span-2 flex flex-1 flex-col w-full gap-4">
      <AppBanner class="h-full" />
      <MatchView class="h-full" />
    </div>
    <NewsStatistics class="flex-shrink-0 w-96" />
  </div>
</template>

<style>
#sidebar {
  background-color: var(--color-background-soft);
}
</style>
