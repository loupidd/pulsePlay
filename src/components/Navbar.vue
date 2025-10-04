<script lang="ts">
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Leagues', href: '#', current: false },
  { name: 'Matches', href: '#', current: false },
  { name: 'Players', href: '#', current: false },
]
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu as HeadlessMenu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/vue/24/outline'

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
    BellIcon,
  },
  data() {
    return {
      navigation: navigation,
    }
  },
  methods: {
    setActive(itemName: string) {
      this.navigation.forEach((item) => {
        item.current = item.name === itemName
      })
    },
  },
}
</script>

<template>
  <Disclosure
    as="nav"
    class="navbar-container relative bg-[#1a1f2e] border-b border-white/5"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
      <div class="flex h-20 items-center justify-between">
        <div class="flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="nav-button relative inline-flex items-center justify-center rounded-lg p-3 text-gray-400 focus:outline-none"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-start">
          <div class="flex shrink-0 items-center gap-4">
            <div
              class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span class="text-white font-bold text-xl hidden sm:block tracking-tight">Pulse</span>
          </div>
          <div class="hidden sm:ml-12 sm:block">
            <div class="flex space-x-3">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                @click.prevent="setActive(item.name)"
                :class="[
                  'nav-item rounded-xl px-5 py-2 text-sm font-medium',
                  item.current ? 'nav-item-active text-white' : 'text-gray-300',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="nav-button relative rounded-xl p-2.5 text-gray-400 focus:outline-none"
          >
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="size-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <HeadlessMenu as="div" class="relative">
            <MenuButton
              class="profile-button relative flex rounded-full focus-visible:outline-none"
            >
              <span class="absolute -inset-1.5" />
              <span class="sr-only">Open user menu</span>
              <img
                class="size-10 rounded-full bg-gray-800 ring-2 ring-white/10"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-4 w-52 origin-top-right rounded-xl bg-[#1a1f2e] py-2 ring-1 ring-white/10 shadow-xl"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      'menu-item block px-5 py-3 text-sm text-gray-300 mx-1 rounded-lg',
                      active ? 'menu-item-hover' : '',
                    ]"
                    >Your profile</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      'menu-item block px-5 py-3 text-sm text-gray-300 mx-1 rounded-lg',
                      active ? 'menu-item-hover' : '',
                    ]"
                    >Settings</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      'menu-item block px-5 py-3 text-sm text-gray-300 mx-1 rounded-lg',
                      active ? 'menu-item-hover' : '',
                    ]"
                    >Sign out</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </HeadlessMenu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-2 px-4 pt-3 pb-4">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          @click.prevent="setActive(item.name)"
          :class="[
            'nav-item block rounded-xl px-5 py-3 text-base font-medium',
            item.current ? 'nav-item-active text-white' : 'text-gray-300',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<style>
/* Navigation Items */
.nav-item {
  position: relative;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.nav-item:hover {
  background-color: var(--color-background-soft);
  transform: translateX(2px);
  color: white;
}

.nav-item:active {
  transform: scale(0.98);
}

.nav-item-active {
  background-color: var(--c-crimson-500) !important;
}

.nav-item-active:hover {
  background-color: var(--c-crimson-500) !important;
  transform: translateX(2px);
}

/* Navigation Buttons */
.nav-button {
  transition: all 0.2s ease;
}

.nav-button:hover {
  background-color: var(--color-background-soft);
  transform: translateX(2px);
  color: white;
}

.nav-button:active {
  transform: scale(0.98);
}

/* Profile Button */
.profile-button {
  transition: all 0.2s ease;
}

.profile-button:hover {
  transform: scale(1.05);
}

.profile-button:active {
  transform: scale(0.98);
}

/* Menu Items */
.menu-item {
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: var(--color-background-soft);
  transform: translateX(2px);
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-item-hover {
  background-color: var(--color-background-soft);
  transform: translateX(2px);
}
</style>
