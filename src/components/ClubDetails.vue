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

        <div class="header-actions">
          <button class="action-button">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Sync to calendar</span>
          </button>
          <button class="follow-button">Follow</button>
        </div>
      </div>

      <!-- Club Header -->
      <div class="club-header">
        <div class="club-logo-container">
          <img :src="club.logo" :alt="club.name" class="club-logo" />
        </div>
        <div class="club-info">
          <h1 class="club-name">{{ club.name }}</h1>
          <p class="club-rank">FIFA #{{ club.fifaRank }}</p>
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
          <div class="section-card">
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
            <div class="form-opponents">
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
              <span class="competition-badge">
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
                <div class="match-time-value">{{ club.nextMatch.time }}</div>
                <div class="match-date">{{ club.nextMatch.date }}</div>
              </div>
              <div class="match-team">
                <img
                  :src="club.nextMatch.opponent.logo"
                  :alt="club.nextMatch.opponent.name"
                  class="match-team-logo"
                />
                <span class="match-team-name">{{ club.nextMatch.opponent.name }}</span>
              </div>
            </div>
          </div>

          <!-- Season Stats -->
          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H2a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"
                  />
                </svg>
                Season stats
              </h3>
              <span class="subtitle">Last starting XI</span>
            </div>
            <div class="formation">
              <div v-for="(player, index) in club.lineup" :key="index" class="player-card">
                <div class="player-avatar">
                  <img v-if="player.photo" :src="player.photo" :alt="player.name" />
                  <div v-else class="player-placeholder"></div>
                </div>
                <div class="player-number">{{ player.number }}</div>
                <div class="player-name">{{ player.name }}</div>
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
          </div>

          <!-- FIFA Rank Chart -->
          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">FIFA rank</h3>
              <div class="rank-info">
                <span class="current-rank">{{ club.fifaRank }}</span>
                <span class="rank-history"
                  >Highest rank: {{ club.highestRank.rank }} ({{ club.highestRank.date }})</span
                >
              </div>
            </div>
            <div class="rank-chart">
              <svg viewBox="0 0 900 200" class="chart-svg">
                <!-- Y-axis labels -->
                <text x="10" y="20" class="axis-label">1</text>
                <text x="10" y="70" class="axis-label">41</text>
                <text x="10" y="120" class="axis-label">81</text>
                <text x="10" y="170" class="axis-label">155</text>

                <!-- Grid lines -->
                <line x1="40" y1="20" x2="900" y2="20" class="grid-line" />
                <line x1="40" y1="70" x2="900" y2="70" class="grid-line" />
                <line x1="40" y1="120" x2="900" y2="120" class="grid-line" />
                <line x1="40" y1="170" x2="900" y2="170" class="grid-line" />

                <!-- Rank line -->
                <path
                  d="M 40 80 L 100 75 L 160 78 L 220 82 L 280 79 L 340 73 L 400 76 L 460 80 L 520 75 L 580 78 L 640 82 L 700 79 L 760 75 L 820 77 L 880 80"
                  fill="none"
                  stroke="var(--c-green-500)"
                  stroke-width="2"
                />

                <!-- X-axis labels -->
                <text x="40" y="195" class="axis-label">1994</text>
                <text x="160" y="195" class="axis-label">1998</text>
                <text x="280" y="195" class="axis-label">2002</text>
                <text x="400" y="195" class="axis-label">2006</text>
                <text x="520" y="195" class="axis-label">2010</text>
                <text x="640" y="195" class="axis-label">2014</text>
                <text x="760" y="195" class="axis-label">2018</text>
                <text x="880" y="195" class="axis-label">2025</text>
              </svg>
            </div>
          </div>

          <!-- Upcoming Fixtures -->
          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H2a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"
                  />
                </svg>
                {{ club.competition }}
              </h3>
            </div>

            <!-- Fixtures List -->
            <div class="fixtures-list">
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
                <button class="fixture-arrow">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Tab -->
        <div v-if="activeTab === 'table'" class="tab-content">
          <div class="section-card">
            <h3 class="section-title">{{ club.competition }}</h3>
            <p class="section-subtitle">Grp. {{ club.group }}</p>

            <div class="table-container">
              <table class="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>PL</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>+/-</th>
                    <th>GD</th>
                    <th>PTS</th>
                    <th>Form</th>
                    <th>Next</th>
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
                    <td>{{ team.goalsFor }}-{{ team.goalsAgainst }}</td>
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
                    <td>
                      <img
                        :src="team.nextOpponent"
                        :alt="'Next opponent'"
                        class="team-logo-small"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot qualified"></span>
                <span>Qualification next stage</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot possible"></span>
                <span>Possible qualification next stage</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Other tabs placeholder -->
        <div v-if="activeTab !== 'overview' && activeTab !== 'table'" class="tab-content">
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
  stats?: {
    goals?: number
    assists?: number
  }
}

interface Fixture {
  day: string
  date: string
  home: string
  away: string
  time: string
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
  nextOpponent: string
  status?: 'qualified' | 'possible'
}

interface ClubDetailsType {
  name: string
  logo: string
  fifaRank: number
  highestRank: {
    rank: number
    date: string
  }
  recentForm: RecentForm[]
  recentOpponents: Opponent[]
  nextMatch: {
    competition: ''
    opponent: { name: ''; logo: '' }
    time: ''
    date: ''
  }

  lineup: Player[]
  competition: string
  group: string
  standings: StandingsTeam[]
  upcomingFixtures: Fixture[]
}

const { club } = defineProps<{ club: ClubDetailsType }>()
defineEmits(['back'])

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'table', label: 'Table' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'squad', label: 'Squad' },
  { id: 'stats', label: 'Stats' },
  { id: 'history', label: 'History' },
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
  margin-bottom: 2rem;
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
  align-items: center;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: var(--color-background-mute);
}

.follow-button {
  padding: 0.5rem 1.5rem;
  background-color: var(--c-white);
  border: none;
  border-radius: 0.5rem;
  color: var(--c-charcoal-900);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-button:hover {
  opacity: 0.9;
}

/* Club Header */
.club-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.club-logo-container {
  width: 4rem;
  height: 4rem;
  background-color: var(--color-background-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.club-rank {
  font-size: 0.875rem;
  color: var(--color-text);
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.nav-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-tab.active {
  border-bottom-color: var(--c-green-500);
  color: var(--color-heading);
}

.nav-tab:hover:not(.active) {
  color: var(--color-heading);
}

/* Content Area */
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

/* Section Card */
.section-card {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-subtitle {
  font-size: 0.75rem;
  color: var(--color-text);
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text);
}

.competition-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(255, 193, 7, 0.1);
  border-radius: 0.25rem;
  color: #ffc107;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Team Form */
.form-results {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-badge {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-badge.win {
  background-color: var(--c-green-500);
  color: white;
}

.form-badge.draw {
  background-color: var(--c-charcoal-500);
  color: white;
}

.form-badge.loss {
  background-color: var(--c-crimson-500);
  color: white;
}

.form-opponents {
  display: flex;
  gap: 0.75rem;
}

.opponent-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-background);
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
  gap: 2rem;
}

.match-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.match-team-logo {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
}

.match-team-name {
  font-size: 0.875rem;
  color: var(--color-text);
  text-align: center;
}

.match-time {
  text-align: center;
}

.match-time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
}

.match-date {
  font-size: 0.75rem;
  color: var(--color-text);
}

/* Formation / Lineup */
.formation {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.player-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-background-mute);
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-background-mute) 0%,
    var(--color-background) 100%
  );
}

.player-number {
  font-size: 0.75rem;
  color: var(--color-text);
}

.player-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-heading);
  text-align: center;
}

.player-stats {
  display: flex;
  gap: 0.25rem;
}

.stat-badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background-color: var(--color-background);
  border-radius: 0.25rem;
}

/* Rank Chart */
.rank-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.current-rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-green-500);
  padding: 0.25rem 0.75rem;
  background-color: rgba(34, 197, 94, 0.1);
  border-radius: 0.5rem;
}

.rank-history {
  font-size: 0.75rem;
  color: var(--color-text);
}

.rank-chart {
  margin-top: 1rem;
}

.chart-svg {
  width: 100%;
  height: 200px;
}

.axis-label {
  font-size: 0.75rem;
  fill: var(--color-text);
}

.grid-line {
  stroke: var(--color-border);
  stroke-width: 1;
  opacity: 0.3;
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
  padding: 0.75rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.fixture-item:hover {
  background-color: var(--color-background-mute);
}

.fixture-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3rem;
}

.fixture-day {
  font-size: 0.75rem;
  color: var(--color-text);
}

.fixture-month {
  font-size: 0.875rem;
  font-weight: 600;
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
  color: var(--color-heading);
}

.vs {
  font-size: 0.75rem;
  color: var(--color-text);
}

.fixture-time {
  font-size: 0.75rem;
  color: var(--color-text);
}

.fixture-arrow {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.25rem;
}

/* Table */
.table-container {
  overflow-x: auto;
  margin: 1rem 0;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.standings-table th {
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.standings-table td {
  padding: 0.75rem 0.5rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.standings-table tr:last-child td {
  border-bottom: none;
}

.standings-table tr.is-club {
  background-color: var(--color-background-mute);
}

.position-indicator {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.position-indicator.qualified {
  background-color: rgba(34, 197, 94, 0.2);
  color: var(--c-green-500);
}

.position-indicator.possible {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.team-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.team-logo-small {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
}

.points {
  font-weight: 600;
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
  font-weight: 600;
}

.form-mini.W {
  background-color: var(--c-green-500);
  color: white;
}

.form-mini.D {
  background-color: var(--c-charcoal-500);
  color: white;
}

.form-mini.L {
  background-color: var(--c-crimson-500);
  color: white;
}

/* Legend */
.legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
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

.legend-dot.qualified {
  background-color: var(--c-green-500);
}

.legend-dot.possible {
  background-color: #ffc107;
}

/* Placeholder */
.placeholder {
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
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .next-match {
    flex-direction: column;
    gap: 1rem;
  }

  .formation {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }

  .table-container {
    overflow-x: scroll;
  }

  .standings-table {
    min-width: 800px;
  }
}
</style>
