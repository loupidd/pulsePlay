<template>
  <transition name="slide-fade" mode="out-in">
    <div v-if="club" key="club-details" class="club-details">
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
      </div>

      <!-- Club Header -->
      <div class="club-header">
        <div class="club-logo-container">
          <img :src="club.logo" :alt="club.name" class="club-logo" />
        </div>
        <div class="club-info">
          <h1 class="club-name">{{ club.name }}</h1>
          <p class="club-country">{{ club.country }}</p>
          <p class="club-founded" v-if="club.founded">Founded: {{ club.founded }}</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <!-- Team Form -->
          <div class="section-card" v-if="club.recentForm && club.recentForm.length > 0">
            <h3 class="section-title">Team form</h3>
            <div class="form-results">
              <div
                v-for="(result, index) in club.recentForm"
                :key="index"
                :class="['form-badge', result.type]"
              >
                {{ result.score }}
              </div>
            </div>
            <div
              class="form-opponents"
              v-if="club.recentOpponents && club.recentOpponents.length > 0"
            >
              <div
                v-for="(opponent, index) in club.recentOpponents"
                :key="index"
                class="opponent-logo"
              >
                <img :src="opponent.logo" :alt="opponent.name" />
              </div>
            </div>
          </div>

          <!-- Next Match -->
          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">Next match</h3>
              <span class="competition-badge" v-if="club.nextMatch?.competition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H2a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"
                  />
                </svg>
                {{ club.nextMatch.competition }}
              </span>
            </div>
            <div class="next-match">
              <div class="match-team">
                <img :src="club.logo" :alt="club.name" class="match-team-logo" />
                <span class="match-team-name">{{ club.name }}</span>
              </div>
              <div class="match-time">
                <div class="match-time-value">{{ club.nextMatch?.time || 'TBD' }}</div>
                <div class="match-date">{{ club.nextMatch?.date || 'TBD' }}</div>
              </div>
              <div class="match-team" v-if="club.nextMatch?.opponent">
                <img
                  :src="club.nextMatch.opponent.logo || ''"
                  :alt="club.nextMatch.opponent.name"
                  class="match-team-logo"
                />
                <span class="match-team-name">{{ club.nextMatch.opponent.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Squad Tab -->
        <div v-if="activeTab === 'squad'" class="tab-content">
          <div class="section-card">
            <h3 class="section-title">Full Squad</h3>
            <div v-if="club.lineup && club.lineup.length > 0" class="squad-grid">
              <div v-for="(player, index) in club.lineup" :key="index" class="player-card">
                <div class="player-avatar">
                  <img v-if="player.photo" :src="player.photo" :alt="player.name" />
                  <div v-else class="player-placeholder">
                    <svg class="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div class="player-number">{{ player.number || 'N/A' }}</div>
                <div class="player-name">{{ player.name }}</div>
                <div class="player-position" v-if="player.position">{{ player.position }}</div>
                <div v-if="player.stats" class="player-stats">
                  <span v-if="player.stats.goals" class="stat-badge"
                    >⚽ {{ player.stats.goals }}</span
                  >
                  <span v-if="player.stats.assists" class="stat-badge"
                    >🅰️ {{ player.stats.assists }}</span
                  >
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No squad data available</p>
            </div>
          </div>
        </div>

        <!-- Table Tab -->
        <div v-if="activeTab === 'table'" class="tab-content">
          <div class="section-card">
            <h3 class="section-title">{{ club.competition || 'League Table' }}</h3>
            <p class="section-subtitle" v-if="club.group">Grp. {{ club.group }}</p>

            <div class="table-container" v-if="club.standings && club.standings.length > 0">
              <table class="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>PL</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>PTS</th>
                    <th>Form</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="team in club.standings"
                    :key="team.position"
                    :class="{ 'is-club': team.name === club.name }"
                  >
                    <td>
                      <span :class="['position-indicator', team.status]">{{ team.position }}</span>
                    </td>
                    <td>
                      <div class="team-cell">
                        <img :src="team.logo" :alt="team.name" class="team-logo-small" />
                        <span>{{ team.name }}</span>
                      </div>
                    </td>
                    <td>{{ team.played }}</td>
                    <td>{{ team.won }}</td>
                    <td>{{ team.drawn }}</td>
                    <td>{{ team.lost }}</td>
                    <td>{{ team.goalsFor }}</td>
                    <td>{{ team.goalsAgainst }}</td>
                    <td>{{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</td>
                    <td class="points">{{ team.points }}</td>
                    <td>
                      <div class="form-badges">
                        <span
                          v-for="(result, i) in team.form"
                          :key="i"
                          :class="['form-mini', result]"
                          >{{ result }}</span
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <p>No standings data available</p>
            </div>

            <div class="legend" v-if="club.standings && club.standings.length > 0">
              <div class="legend-item">
                <span class="legend-dot qualified"></span>
                <span>Qualification</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot possible"></span>
                <span>Possible qualification</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixtures Tab -->
        <div v-if="activeTab === 'fixtures'" class="tab-content">
          <div class="section-card">
            <h3 class="section-title">Upcoming Fixtures</h3>
            <div
              v-if="club.upcomingFixtures && club.upcomingFixtures.length > 0"
              class="fixtures-list"
            >
              <div
                v-for="(fixture, index) in club.upcomingFixtures"
                :key="index"
                class="fixture-item"
              >
                <div class="fixture-date">
                  <div class="fixture-day">{{ fixture.day }}</div>
                  <div class="fixture-month">{{ fixture.date }}</div>
                </div>
                <div class="fixture-match">
                  <div class="fixture-teams">
                    <span class="fixture-team">{{ fixture.home }}</span>
                    <span class="vs">vs</span>
                    <span class="fixture-team">{{ fixture.away }}</span>
                  </div>
                  <div class="fixture-time">{{ fixture.time }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No upcoming fixtures available</p>
            </div>
          </div>
        </div>

        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats'" class="tab-content">
          <div class="section-card placeholder">
            <p>Statistics content coming soon...</p>
          </div>
        </div>

        <!-- Other tabs placeholder -->
        <div
          v-if="!['overview', 'squad', 'table', 'fixtures', 'stats'].includes(activeTab)"
          class="tab-content"
        >
          <div class="section-card placeholder">
            <p>{{ activeTab }} content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface RecentForm {
  score: string
  type: 'win' | 'draw' | 'loss'
}

interface Opponent {
  name: string
  logo: string
}

interface Player {
  number: number
  name: string
  photo?: string
  position?: string
  age?: number
  stats?: {
    goals?: number
    assists?: number
  }
}

interface StandingsTeam {
  position: number
  name: string
  logo: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
  nextOpponent?: string
  status?: 'qualified' | 'possible'
}

interface Fixture {
  day: string
  date: string
  home: string
  away: string
  time: string
}

interface ClubDetailsType {
  name: string
  logo: string
  country: string
  founded?: number
  venue?: string
  fifaRank?: number
  highestRank?: {
    rank: number
    date: string
  }
  recentForm?: RecentForm[]
  recentOpponents?: Opponent[]
  nextMatch?: {
    competition: string
    opponent: { name: string; logo: string }
    time: string
    date: string
  }
  lineup: Player[]
  competition: string
  group?: string
  standings: StandingsTeam[]
  upcomingFixtures?: Fixture[]
}

const { club } = defineProps<{ club: ClubDetailsType }>()
defineEmits(['back'])

const activeTab = ref('squad')

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'squad', label: 'Squad' },
  { id: 'table', label: 'Table' },
]
</script>

<style scoped>
.club-details {
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

.back-button {
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

.back-button:hover {
  color: var(--color-heading);
  background-color: var(--color-background-soft);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.follow-button {
  padding: 0.625rem 1.5rem;
  background-color: white;
  color: var(--color-background);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Club Header */
.club-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.club-logo-container {
  width: 5rem;
  height: 5rem;
  background-color: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
}

.club-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.club-info {
  flex: 1;
}

.club-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.club-country {
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.7;
}

.club-founded {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.6;
  margin-top: 0.25rem;
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-border);
}

.nav-tab {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text);
  border-bottom: 2px solid transparent;
}

.nav-tab.active {
  color: var(--color-heading);
  border-bottom-color: var(--c-green-500);
}

.nav-tab:hover:not(.active) {
  color: var(--color-heading);
}

/* Content Section */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-card {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Form */
.form-results {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-badge {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.form-badge.win {
  background-color: var(--c-green-500);
}

.form-badge.draw {
  background-color: var(--c-charcoal-500);
}

.form-badge.loss {
  background-color: var(--c-crimson-500);
}

.form-opponents {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.opponent-logo {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.opponent-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Next Match */
.next-match {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.match-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.match-team-logo {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.match-team-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.match-time {
  text-align: center;
}

.match-time-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}

.match-date {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.competition-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--c-crimson-100);
  color: var(--c-crimson-700);
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

/* Squad Grid */
.squad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.player-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.75rem;
  background-color: var(--color-background-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--c-crimson-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.player-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 0.25rem;
}

.player-position {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.player-stats {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--color-background);
  border-radius: 0.25rem;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.standings-table th {
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.7;
  border-bottom: 1px solid var(--color-border);
}

.standings-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.standings-table tbody tr:hover {
  background-color: var(--color-background-mute);
}

.standings-table tbody tr.is-club {
  background-color: var(--c-crimson-100);
}

.standings-table tbody tr.is-club td {
  color: var(--c-crimson-900);
  font-weight: 600;
}

.team-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.team-logo-small {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.position-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.position-indicator.qualified {
  background-color: var(--c-green-500);
  color: white;
}

.position-indicator.possible {
  background-color: var(--c-yellow-500);
  color: white;
}

.points {
  font-weight: 700;
  color: var(--color-heading);
}

.form-badges {
  display: flex;
  gap: 0.25rem;
}

.form-mini {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
}

.form-mini.W {
  background-color: var(--c-green-500);
}

.form-mini.D {
  background-color: var(--c-charcoal-500);
}

.form-mini.L {
  background-color: var(--c-crimson-500);
}

/* Legend */
.legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
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
  border-radius: 0.125rem;
}

.legend-dot.qualified {
  background-color: var(--c-green-500);
}

.legend-dot.possible {
  background-color: var(--c-yellow-500);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text);
  opacity: 0.6;
}

/* Fixtures */
.fixtures-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fixture-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.fixture-item:hover {
  transform: translateX(2px);
  background-color: var(--color-background);
}

.fixture-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3rem;
  padding: 0.5rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
}

.fixture-day {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
}

.fixture-month {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-heading);
}

.fixture-match {
  flex: 1;
}

.fixture-teams {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.fixture-team {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
}

.vs {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.5;
}

.fixture-time {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

/* Placeholder */
.placeholder {
  text-align: center;
  padding: 3rem;
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
  .squad-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .table-container {
    overflow-x: scroll;
  }

  .standings-table {
    font-size: 0.75rem;
  }
}
</style>
