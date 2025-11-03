import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import './assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

//Register Pinia
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')
