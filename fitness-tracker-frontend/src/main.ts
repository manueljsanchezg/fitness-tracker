import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

const pinia = createPinia()

createApp(App)
    .use(Buefy)
    .use(router)
    .use(pinia)
    .mount('#app')
