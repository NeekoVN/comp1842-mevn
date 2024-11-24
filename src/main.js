import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { Theme } from '@primevue/themes'

createApp(App).mount('#app')
App.use(PrimeVue, { theme: { preset: Aura } })
