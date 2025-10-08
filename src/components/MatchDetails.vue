<template>
  <transition name="slide-fade" mode="out-in">
    <div v-if="match" key="details" class="match-details">
      <!-- Header -->
      <div class="header">
        <button @click="$emit('back')" class="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>

        <button class="favorite-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            :fill="match.isFavorite ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      <!-- Match Card -->
      <div
        class="match-card"
        :style="{
          background: `linear-gradient(135deg, ${match.gradientFrom} 0%, ${match.gradientTo} 100%)`,
        }"
      >
        <div class="match-card-content">
          <!-- Competition Info -->
          <div class="competition-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span>{{ match.competitions }}</span>
          </div>
          <div class="match-day">{{ match.date }}</div>

          <!-- Teams and Score -->
          <div class="teams-container">
            <!-- Home Team -->
            <div class="team" @click="$emit('viewClub', match.homeTeam)" style="cursor: pointer">
              <div class="team-logo">
                <img :src="match.homeTeam.logo" :alt="match.homeTeam.name" />
              </div>
              <span class="team-name">{{ match.homeTeam.name }}</span>
            </div>

            <!-- Score -->
            <div class="score-container">
              <div class="score">{{ match.homeTeam.score }} : {{ match.awayTeam.score }}</div>
              <span class="live-badge">Full Time</span>
            </div>

            <!-- Away Team -->
            <div class="team" @click="$emit('viewClub', match.awayTeam)" style="cursor: pointer">
              <div class="team-logo">
                <img :src="match.awayTeam.logo" :alt="match.awayTeam.name" />
              </div>
              <span class="team-name">{{ match.awayTeam.name }}</span>
            </div>
          </div>

          <!-- Goals Timeline (if available) -->
          <div v-if="matchGoals.length > 0" class="goals-timeline">
            <div
              v-for="(goal, index) in matchGoals"
              :key="index"
              :class="['goal-event', `goal-${goal.team}`]"
            >
              <template v-if="goal.team === 'home'">
                <span class="goal-player">{{ goal.player }}</span>
                <span class="goal-icon">{{ goal.icon }}</span>
                <span class="goal-minute">{{ goal.minute }}</span>
              </template>
              <template v-else>
                <span class="goal-minute">{{ goal.minute }}</span>
                <span class="goal-icon">{{ goal.icon }}</span>
                <span class="goal-player">{{ goal.player }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'" class="content-section">
        <!-- Timeline Chart -->
        <div class="timeline-chart">
          <svg viewBox="0 0 600 120" class="chart-svg">
            <!-- Grid lines -->
            <line
              v-for="i in 6"
              :key="`grid-${i}`"
              :x1="100 * (i - 1)"
              y1="0"
              :x2="100 * (i - 1)"
              y2="120"
              stroke="rgba(107, 114, 128, 0.1)"
              stroke-width="1"
            />

            <!-- Center line -->
            <line
              x1="0"
              y1="60"
              x2="600"
              y2="60"
              stroke="rgba(107, 114, 128, 0.2)"
              stroke-width="1"
            />

            <!-- Home team wave -->
            <path
              d="M 0 60 Q 50 30, 100 50 T 200 40 T 300 35 T 400 55 T 500 45 T 600 50"
              fill="rgba(220, 38, 38, 0.15)"
              stroke="rgba(220, 38, 38, 0.6)"
              stroke-width="2"
            />

            <!-- Away team wave -->
            <path
              d="M 0 60 Q 50 85, 100 75 T 200 80 T 300 90 T 400 70 T 500 80 T 600 75"
              fill="rgba(107, 114, 128, 0.15)"
              stroke="rgba(107, 114, 128, 0.6)"
              stroke-width="2"
            />

            <!-- Event markers -->
            <circle cx="50" cy="50" r="5" fill="var(--c-crimson-500)" />
            <circle cx="150" cy="40" r="5" fill="var(--c-crimson-500)" />
            <circle cx="350" cy="55" r="5" fill="var(--c-crimson-500)" />
            <circle cx="150" cy="80" r="5" fill="var(--c-charcoal-500)" />

            <!-- Cards -->
            <rect x="290" y="35" width="4" height="6" fill="#fbbf24" />
            <rect x="390" y="70" width="4" height="6" fill="var(--c-crimson-500)" />
          </svg>

          <div class="time-markers">
            <span v-for="time in ['15\'', '30\'', 'HT', '60\'', '75\'', '90\'']" :key="time">{{
              time
            }}</span>
          </div>

          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot yellow"></span>
              <span>Yellow Card</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot red"></span>
              <span>Red Card</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot white"></span>
              <span>Goal</span>
            </div>
          </div>
        </div>

        <!-- Stats Bars -->
        <div class="stats-container">
          <div v-for="(stat, index) in match.stats" :key="index" class="stat-row">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-bars">
              <span class="stat-value">{{ stat.home }}</span>
              <div class="bar-container">
                <div
                  class="bar home"
                  :style="{ width: getBarWidth(stat.home, stat.away) + '%' }"
                ></div>
              </div>
              <div class="bar-container reverse">
                <div
                  class="bar away"
                  :style="{ width: getBarWidth(stat.away, stat.home) + '%' }"
                ></div>
              </div>
              <span class="stat-value">{{ stat.away }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lineups Tab -->
      <div v-if="activeTab === 'lineups'" class="content-section">
        <div class="lineups-grid">
          <!-- Home Team -->
          <div class="lineup-column">
            <h4 class="lineup-title home">{{ match.homeTeam.name }}</h4>
            <ul class="lineup-list">
              <li v-for="(player, i) in match.homeTeam.lineup" :key="i" class="lineup-player">
                <span class="player-number home">{{ i + 1 }}</span>
                <span>{{ player }}</span>
              </li>
            </ul>
          </div>

          <!-- Away Team -->
          <div class="lineup-column">
            <h4 class="lineup-title away">{{ match.awayTeam.name }}</h4>
            <ul class="lineup-list">
              <li v-for="(player, i) in match.awayTeam.lineup" :key="i" class="lineup-player">
                <span class="player-number away">{{ i + 1 }}</span>
                <span>{{ player }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Other Tabs -->
      <div
        v-if="activeTab === 'news' || activeTab === 'timeline'"
        class="content-section placeholder"
      >
        <p>Content for {{ activeTab }} coming soon...</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Team {
  name: string
  logo: string
  score: number
  lineup: string[]
}

interface Stat {
  label: string
  home: string | number
  away: string | number
}

interface Goal {
  player: string
  minute: string
  team: 'home' | 'away'
  icon: string
}

interface MatchDetailsType {
  id: string
  competitions: string
  date: string
  homeTeam: Team
  awayTeam: Team
  stats: Stat[]
  goals?: Goal[]
  gradientFrom: string
  gradientTo: string
  isFavorite: boolean
}

const { match } = defineProps<{ match: MatchDetailsType }>()
defineEmits(['back', 'viewClub'])

const activeTab = ref('stats')

const tabs = [
  { id: 'stats', label: 'Stats' },
  { id: 'lineups', label: 'Lineups' },
  { id: 'news', label: 'Match News' },
  { id: 'timeline', label: 'Timeline' },
]

// Computed property to handle optional goals
const matchGoals = computed(() => match.goals || [])

const getBarWidth = (value: string | number, opponent: string | number): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const numOpponent = typeof opponent === 'string' ? parseFloat(opponent) : opponent
  const max = Math.max(numValue, numOpponent) * 1.2
  return (numValue / max) * 100
}
</script>

<style scoped>
.match-details {
  background-color: var(--color-background);
  min-height: 100vh;
  padding: 1.5rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.back-button,
.favorite-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.back-button:hover,
.favorite-button:hover {
  color: var(--color-heading);
  background-color: var(--color-background-soft);
}

/* Match Card */
.match-card {
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.match-card-content {
  position: relative;
  z-index: 10;
}

.competition-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.match-day {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  margin-bottom: 2rem;
}

.teams-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 6rem;
}

.team-logo {
  width: 4rem;
  height: 4rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.team-logo img {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
}

.team-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.score-container {
  text-align: center;
}

.score {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.live-badge {
  display: inline-block;
  background-color: var(--c-crimson-500);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

/* Goals Timeline */
.goals-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.goal-event {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.goal-home {
  justify-content: flex-start;
}

.goal-away {
  justify-content: flex-end;
}

.goal-player {
  color: rgba(255, 255, 255, 0.9);
}

.goal-icon {
  font-size: 1.25rem;
}

.goal-minute {
  color: rgba(255, 255, 255, 0.6);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.tab-button {
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.tab-button.active {
  background-color: var(--c-crimson-100);
  color: var(--c-crimson-700);
}

.tab-button:hover:not(.active) {
  background-color: var(--color-background-mute);
}

/* Content Section */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Timeline Chart */
.timeline-chart {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.chart-svg {
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
}

.time-markers {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  opacity: 0.6;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.75rem;
  color: var(--color-text);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.legend-dot.yellow {
  background-color: #fbbf24;
}

.legend-dot.red {
  background-color: var(--c-crimson-500);
}

.legend-dot.white {
  background-color: var(--c-white);
}

/* Stats Container */
.stats-container {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

.stat-bars {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-value {
  width: 2rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-heading);
}

.bar-container {
  flex: 1;
  height: 0.5rem;
  background-color: var(--color-background-mute);
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
}

.bar-container.reverse {
  flex-direction: row-reverse;
}

.bar {
  height: 100%;
  transition: width 0.3s ease;
}

.bar.home {
  background-color: var(--c-crimson-500);
}

.bar.away {
  background-color: var(--c-charcoal-500);
}

/* Lineups */
.lineups-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.lineup-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lineup-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-heading);
}

.lineup-title.home {
  color: var(--c-crimson-500);
}

.lineup-title.away {
  color: var(--c-charcoal-500);
}

.lineup-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lineup-player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.player-number {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.player-number.home {
  background-color: rgba(220, 38, 38, 0.1);
  color: var(--c-crimson-500);
}

.player-number.away {
  background-color: rgba(107, 114, 128, 0.1);
  color: var(--c-charcoal-500);
}

/* Placeholder */
.placeholder {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 3rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.6;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive */
@media (max-width: 768px) {
  .lineups-grid {
    grid-template-columns: 1fr;
  }

  .teams-container {
    gap: 1rem;
  }

  .score {
    font-size: 2.5rem;
  }
}
</style>
