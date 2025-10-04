<template>
  <div
    class="flex flex-col gap-6 p-4 !h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto"
  >
    <h2 class="text-lg font-semibold mb-1 px-1">Clubs & Competitions</h2>

    <div class="flex flex-col gap-8">
      <div v-for="competition in competitions" :key="competition.id">
        <!-- Competition -->
        <div
          @click="toggleFilter(competition.id)"
          class="filter-item flex items-center gap-3 px-3 py-3.5 rounded-xl cursor-pointer transition-all"
          :class="{ 'filter-active': isSelected(competition.id) }"
        >
          <div
            class="bg-white rounded-full w-10 h-10 flex-shrink-0"
            :style="{
              backgroundImage: `url(${competition.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
          ></div>
          <span class="text-sm font-medium truncate">{{ competition.name }}</span>
        </div>

        <!-- Clubs -->
        <div class="ml-8 mt-4 space-y-3 pl-0">
          <div
            v-for="club in competition.clubs"
            :key="club.id"
            @click="toggleFilter(club.id)"
            class="filter-item flex items-center gap-2.5 px-3 py-3 rounded-lg cursor-pointer transition-all"
            :class="{ 'filter-active': isSelected(club.id) }"
          >
            <div
              class="rounded-full w-6 h-6 bg-white flex-shrink-0"
              :style="{
                backgroundImage: `url(${club.image})`,
                backgroundSize: '70%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }"
            ></div>
            <span class="text-xs font-medium truncate">{{ club.name }}</span>
          </div>
        </div>
      </div>

      <!-- Add button -->
      <div
        class="filter-item flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border border-color justify-center"
      >
        <div
          class="rounded-full w-7 h-7 bg-add-club relative flex justify-center items-center flex-shrink-0"
        >
          <div class="absolute w-0.5 h-3.5 bg-plus"></div>
          <div class="absolute h-0.5 w-3.5 bg-plus"></div>
        </div>
        <span class="text-sm font-medium truncate">Add Filter</span>
      </div>
    </div>
  </div>
</template>

<style>
.filter-item {
  margin-bottom: 12px;
}
.filter-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}

.filter-item:active {
  transform: scale(0.98);
}

.filter-active {
  background-color: var(--c-crimson-500);
}

.filter-active:hover {
  background-color: var(--c-crimson-600);
}

.bg-add-club {
  background-color: var(--color-background-mute);
}

.bg-plus {
  background-color: var(--color-heading);
}

.border-color {
  border-color: rgba(107, 114, 128, 0.3);
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
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
          name: 'Champions League',
          image: 'https://tmssl.akamaized.net//images/logo/header/cl.png?lm=1626810555',
          clubs: [
            {
              id: 101,
              name: 'Real Madrid',
              image: 'https://tmssl.akamaized.net//images/wappen/head/418.png?lm=1729684474',
            },
            {
              id: 102,
              name: 'Barcelona',
              image: 'https://tmssl.akamaized.net//images/wappen/head/131.png?lm=1406739548',
            },
          ],
        },
        {
          id: 2,
          name: 'Premier League',
          image: 'https://tmssl.akamaized.net//images/logo/header/gb1.png?lm=1521104656',
          clubs: [
            {
              id: 201,
              name: 'Manchester United',
              image: 'https://tmssl.akamaized.net//images/wappen/head/985.png?lm=1457975903',
            },
            {
              id: 202,
              name: 'Liverpool',
              image: 'https://tmssl.akamaized.net//images/wappen/head/31.png?lm=1456567819',
            },
          ],
        },
        {
          id: 3,
          name: 'Bundesliga',
          image: 'https://tmssl.akamaized.net//images/logo/header/l1.png?lm=1525905518',
          clubs: [
            {
              id: 301,
              name: 'Bayern Munich',
              image: 'https://tmssl.akamaized.net//images/wappen/head/27.png?lm=1498251238',
            },
            {
              id: 302,
              name: 'Borussia Dortmund',
              image: 'https://tmssl.akamaized.net//images/wappen/head/16.png?lm=1456996989',
            },
          ],
        },
        {
          id: 4,
          name: 'Europa League',
          image: 'https://tmssl.akamaized.net//images/logo/header/el.png?lm=1721915137',
          clubs: [
            {
              id: 501,
              name: 'Losc lille',
              image: 'https://tmssl.akamaized.net//images/wappen/head/1082.png?lm=1529521041',
            },
            {
              id: 502,
              name: 'AS Roma',
              image: 'https://tmssl.akamaized.net//images/wappen/head/12.png?lm=1751979202',
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
