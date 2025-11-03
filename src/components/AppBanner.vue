<template>
  <div class="relative overflow-hidden rounded-2xl shadow-lg h-full">
    <!-- Background with gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-gray-900">
      <div
        class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"
      ></div>
    </div>

    <!-- Content -->
    <div class="banner-content">
      <!-- Left Content -->
      <div class="flex-1 max-w-2xl">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            />
          </svg>
          <span class="text-white/90 text-sm font-semibold uppercase tracking-wide">
            {{ greeting }}
          </span>
        </div>

        <h1 class="text-white text-4xl md:text-5xl font-bold mb-3">
          {{ title }}
        </h1>

        <p class="text-white/80 text-lg md:text-xl max-w-xl">
          {{ subtitle }}
        </p>
      </div>

      <!-- Right Content - Floating Pulse Logo -->
      <div class="logo-container">
        <div class="logo-wrapper">
          <svg class="logo-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface WelcomeBanner {
  greeting?: string
  title?: string
  subtitle?: string
}

const props = withDefaults(
  defineProps<{
    bannerData?: WelcomeBanner
    userName?: string
  }>(),
  {
    bannerData: () => ({
      greeting: 'Welcome Back',
      title: 'Your Football Hub',
      subtitle: 'Stay updated with live scores, match schedules, and league standings',
    }),
  },
)

const greeting = computed(() => {
  if (props.userName) {
    return `Welcome Back, ${props.userName}`
  }
  return props.bannerData?.greeting || 'Welcome Back'
})

const title = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning, Football Fan!'
  if (hour < 18) return 'Good Afternoon, Football Fan!'
  return 'Good Evening, Football Fan!'
})

const subtitle = computed(() => {
  return (
    props.bannerData?.subtitle ||
    'Stay updated with live scores, match schedules, and league standings'
  )
})
</script>

<style scoped>
.banner-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem;
}

@media (max-width: 768px) {
  .banner-content {
    padding: 2rem;
  }
}

.logo-container {
  position: relative;
  width: 12rem;
  height: 12rem;
  display: none;
}

@media (min-width: 1024px) {
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.logo-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.logo-svg {
  width: 5rem;
  height: 5rem;
  color: white;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
</style>
