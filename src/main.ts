import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
const app = createApp(App)
import './assets/main.css'
import './assets/tailwind.css'

app.use(router)
app.mount('#app')
app.component('App', App)
