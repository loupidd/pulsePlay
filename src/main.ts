import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
const app = createApp(App)
import './assets/main.css'
import './assets/tailwind.css'
import { createPinia } from 'pinia'
const pinia = createPinia()

app.use(router)
app.mount('#app')
app.component('App', App)
app.use(pinia)
