import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard - PulsePlay',
      },
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchView.vue'),
      meta: {
        title: 'Matches - PulsePlay',
      },
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
      meta: {
        title: 'Trending News - PulsePlay',
      },
    },
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Restore scroll position when using browser back/forward buttons
    if (savedPosition) {
      return savedPosition
    } else {
      // Scroll to top for new routes
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'PulsePlay'
  next()
})

export default router
