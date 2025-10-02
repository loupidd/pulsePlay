<template>
  <div class="flex flex-col gap-6 p-4 !h-[60vh] overflow-y-auto">
    <h2 class="text-lg font-semibold mb-1 px-1">CLUBS & COMPETITIONS</h2>

    <div class="space-y-4 gap-4 flex flex-col">
      <div v-for="competition in competitions" :key="competition.id">
        <!-- Competition -->
        <div
          @click="toggleFilter(competition.id)"
          class="filter-item flex space-y-2 items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all"
          :class="{ 'filter-active': isSelected(competition.id) }"
        >
          <div
            class="rounded-full w-10 h-10 p-1.5 bg-white flex-shrink-0"
            :style="{
              backgroundImage: `url(${competition.image})`,
              backgroundSize: '70%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
          ></div>
          <span class="text-xs font-medium truncate">{{ competition.name }}</span>
        </div>

        <!-- Clubs -->
        <div class="ml-6 mt-2 space-y-1.5 pl-2 border-l-2 border-color">
          <div
            v-for="club in competition.clubs"
            :key="club.id"
            @click="toggleFilter(club.id)"
            class="filter-item flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all"
            :class="{ 'filter-active': isSelected(club.id) }"
          >
            <div
              class="rounded-full w-5 h-5 bg-white flex-shrink-0"
              :style="{
                backgroundImage: `url(${club.image})`,
                backgroundSize: '80%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }"
            ></div>
            <span class="text-xs truncate">{{ club.name }}</span>
          </div>
        </div>
      </div>

      <!-- Add button -->
      <div
        class="filter-item flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all border border-color t-6 justify-center"
      >
        <div
          class="rounded-full w-6 h-6 bg-add-club relative flex justify-center items-center flex-shrink-0"
        >
          <div class="absolute w-0.5 h-3 bg-plus"></div>
          <div class="absolute h-0.5 w-3 bg-plus"></div>
        </div>
        <span class="text-xs truncate">Add Filter</span>
      </div>
    </div>
  </div>
</template>

<style>
.filter-item {
  background-color: transparent;
}

.filter-item:hover {
  background-color: var(--color-background-mute);
  transform: translateX(2px);
}

.filter-item:active {
  transform: scale(0.98);
}

.filter-active {
  background-color: var(--color-background-mute);
  border-left: 2px solid var(--color-success);
}

.bg-add-club {
  background-color: var(--color-background-mute);
}

.bg-plus {
  background-color: var(--color-background-soft);
}

.border-color {
  border-color: var(--c-charcoal-500);
}
</style>

<script lang="ts">
export default {
  name: 'ClubCompetitions',
  data() {
    return {
      selectedFilters: [] as number[],
      competitions: [
        {
          id: 1,
          name: 'Serie B',
          image: 'https://tmssl.akamaized.net//images/logo/header/it2.png?lm=1720690779',
          clubs: [
            {
              id: 101,
              name: 'Modena FC',
              image: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2573.png',
            },
            {
              id: 102,
              name: 'Venezia FC',
              image: 'https://tmssl.akamaized.net//images/wappen/head/607.png?lm=1657392944',
            },
          ],
        },
        {
          id: 2,
          name: 'Premiere League',
          image: 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/23.png',
          clubs: [
            {
              id: 201,
              name: 'Manchester United',
              image: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/360.png',
            },
          ],
        },
      ],
    }
  },
  methods: {
    toggleFilter(id: number): void {
      const index = this.selectedFilters.indexOf(id)
      if (index > -1) {
        this.selectedFilters.splice(index, 1)
      } else {
        this.selectedFilters.push(id)
      }
      // Emit event to parent component to filter results
      this.$emit('filter-changed', this.selectedFilters)
    },
    isSelected(id: number): boolean {
      return this.selectedFilters.includes(id)
    },
  },
}
</script>
