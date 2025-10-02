<script lang="ts">
import AppBanner from '../components/Banner.vue'
import ClubCompetitions from '../components/ClubCompetitions.vue'
import MatchResults from '../components/MatchResults.vue'
import NewsStatistics from '..//components/NewsStatistics.vue'

export default {
  name: 'DashboardView',
  components: {
    AppBanner,
    ClubCompetitions,
    MatchResults,
    NewsStatistics,
  },
}
</script>

<template>
  <div class="flex gap-4 p-4 min-h-screen">
    <ClubCompetitions
      id="sidebar"
      class="self-start w-48 top-4 flex-shrink-0 sticky rounded-2xl p-4 h-[calc(100vh-2rem)] shadow-lg"
    />
    <div class="col-span-1 md:col-span-2 lg:col-span-2 flex flex-1 flex-col w-full gap-4">
      <AppBanner class="border-1 border-red-400 h-96" />
      <MatchResults class="border-1 border-amber-300 h-full" />
    </div>
    <NewsStatistics class="border-1 border-fuchsia-400 flex-shrink-0 w-96" />
  </div>
</template>

<style>
#sidebar {
  background-color: var(--color-background-soft);
}
</style>
