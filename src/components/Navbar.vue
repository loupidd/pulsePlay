<script lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu as HeadlessMenu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, BellIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

export default {
  name: 'PulseNavbar',
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    HeadlessMenu,
    MenuButton,
    MenuItems,
    MenuItem,
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    BellIcon,
  },
  setup(props, { emit }) {
    const route = useRoute()
    const searchQuery = ref('')
    const isSearchFocused = ref(false)

    const navigation = computed(() => [
      { name: 'Dashboard', path: '/', current: route.name === 'dashboard' },
      { name: 'News', path: '/news', current: route.name === 'news' },
    ])

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim())
      }
    }

    const handleSearchInput = () => {
      emit('search', searchQuery.value.trim())
    }

    const clearSearch = () => {
      searchQuery.value = ''
      handleSearchInput()
    }

    return {
      navigation,
      searchQuery,
      isSearchFocused,
      handleSearch,
      handleSearchInput,
      clearSearch,
    }
  },
}
</script>

<template>
  <Disclosure as="nav" class="navbar-container" v-slot="{ open }">
    <div class="navbar-inner">
      <div class="navbar-content">
        <!-- Mobile menu button -->
        <div class="mobile-menu-wrapper">
          <DisclosureButton class="nav-button mobile-menu-btn">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="icon-size" aria-hidden="true" />
            <XMarkIcon v-else class="icon-size" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <!-- Logo -->
        <router-link to="/" class="logo-wrapper">
          <div class="logo-icon">
            <svg class="logo-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span class="logo-text">Pulse</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <div class="nav-links">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              :class="['nav-item', { 'nav-item-active': item.current }]"
              :aria-current="item.current ? 'page' : undefined"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Search Bar (Centered) -->
        <div class="search-container">
          <div class="search-wrapper" :class="{ 'search-focused': isSearchFocused }">
            <MagnifyingGlassIcon class="search-icon" />
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
              type="text"
              placeholder="Search by club name..."
              class="search-input"
            />
            <button v-if="searchQuery" @click="clearSearch" class="search-clear">
              <XMarkIcon class="clear-icon" />
            </button>
          </div>
        </div>

        <!-- Right side actions -->
        <div class="actions-wrapper">
          <!-- Notification Button -->
          <button type="button" class="nav-button notification-btn">
            <span class="sr-only">View notifications</span>
            <BellIcon class="icon-size" aria-hidden="true" />
            <span class="notification-badge"></span>
          </button>

          <!-- Profile dropdown -->
          <HeadlessMenu as="div" class="profile-menu">
            <MenuButton class="profile-button">
              <span class="sr-only">Open user menu</span>
              <div class="profile-image-wrapper">
                <img
                  class="profile-image"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
                <span class="status-indicator"></span>
              </div>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95 translate-y-1"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="profile-dropdown">
                <div class="dropdown-header">
                  <p class="user-name">John Doe</p>
                  <p class="user-email">john@example.com</p>
                </div>
                <MenuItem v-slot="{ active }">
                  <a href="#" :class="['menu-item', { 'menu-item-hover': active }]">
                    <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="#" :class="['menu-item', { 'menu-item-hover': active }]">
                    <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </a>
                </MenuItem>
                <div class="dropdown-divider"></div>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="['menu-item menu-item-signout', { 'menu-item-hover': active }]"
                  >
                    <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </HeadlessMenu>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Panel -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <DisclosurePanel class="mobile-panel">
        <div class="mobile-nav-links">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="div">
            <router-link
              :to="item.path"
              :class="['nav-item mobile-nav-item', { 'nav-item-active': item.current }]"
              :aria-current="item.current ? 'page' : undefined"
            >
              {{ item.name }}
            </router-link>
          </DisclosureButton>
        </div>

        <!-- Mobile Search -->
        <div class="mobile-search">
          <div class="search-wrapper">
            <MagnifyingGlassIcon class="search-icon" />
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search by club name..."
              class="search-input"
            />
            <button v-if="searchQuery" @click="clearSearch" class="search-clear">
              <XMarkIcon class="clear-icon" />
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>

<style scoped>
/* Navbar Container */
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar-inner {
  max-width: 100%;
  margin: 0;
  padding: 0 24px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 24px;
}

/* Mobile Menu Button */
.mobile-menu-wrapper {
  display: none;
}

.mobile-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  color: rgba(156, 163, 175, 1);
}

/* Logo */
.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #db2777 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-icon:hover {
  transform: scale(1.05);
}

.logo-svg {
  width: 24px;
  height: 24px;
  color: white;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #ffffff, #d1d5db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desktop Navigation */
.desktop-nav {
  display: block;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(209, 213, 219, 1);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  transform: translateY(-1px);
}

.nav-item:active {
  transform: translateY(0) scale(0.98);
}

.nav-item-active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.nav-item-active:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
}

/* Search Container */
.search-container {
  flex: 1;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.search-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-wrapper:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.search-focused {
  background: rgba(255, 255, 255, 0.08);
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: rgba(156, 163, 175, 1);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 40px;
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(156, 163, 175, 1);
}

.search-clear {
  position: absolute;
  right: 8px;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(156, 163, 175, 1);
  cursor: pointer;
  transition: all 0.2s;
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.clear-icon {
  width: 16px;
  height: 16px;
}

/* Actions Wrapper */
.actions-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Navigation Buttons */
.nav-button {
  position: relative;
  padding: 10px;
  border-radius: 12px;
  color: rgba(156, 163, 175, 1);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  transform: scale(1.05);
}

.nav-button:active {
  transform: scale(0.95);
}

.icon-size {
  width: 24px;
  height: 24px;
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #111827;
}

/* Profile Menu */
.profile-menu {
  position: relative;
}

.profile-button {
  display: flex;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
}

.profile-button:hover {
  transform: scale(1.05);
}

.profile-button:active {
  transform: scale(0.95);
}

.profile-button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.2);
  outline-offset: 2px;
}

.profile-image-wrapper {
  position: relative;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1f2937;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.2s;
}

.profile-button:hover .profile-image {
  border-color: rgba(255, 255, 255, 0.2);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border-radius: 50%;
  border: 2px solid #111827;
}

/* Profile Dropdown */
.profile-dropdown {
  position: absolute;
  right: 0;
  z-index: 10;
  margin-top: 12px;
  width: 224px;
  border-radius: 12px;
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(12px);
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-email {
  font-size: 12px;
  color: rgba(156, 163, 175, 1);
  margin-top: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin: 4px 8px;
  border-radius: 8px;
  font-size: 14px;
  color: rgba(209, 213, 219, 1);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover,
.menu-item-hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.menu-item-signout {
  color: rgba(248, 113, 113, 1);
}

.menu-item-signout:hover,
.menu-item-signout.menu-item-hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgba(252, 165, 165, 1);
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 4px 0;
}

/* Mobile Panel */
.mobile-panel {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
}

.mobile-nav-item {
  display: block;
  padding: 12px 16px;
  font-size: 16px;
}

.mobile-search {
  padding: 0 16px 16px 16px;
}

.mobile-search .search-wrapper {
  width: 100%;
}

/* Responsive Breakpoints */
@media (min-width: 640px) {
  .navbar-content {
    height: 80px;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
  }

  .logo-svg {
    width: 26px;
    height: 26px;
  }

  .profile-image {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 639px) {
  .navbar-inner {
    padding: 0 16px;
  }

  .mobile-menu-wrapper {
    display: flex;
    align-items: center;
  }

  .desktop-nav {
    display: none;
  }

  .search-container {
    display: none;
  }

  .actions-wrapper {
    gap: 8px;
  }

  .logo-text {
    font-size: 20px;
  }
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
  .navbar-container {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}
</style>
