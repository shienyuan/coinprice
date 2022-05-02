import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Plugins
import PrimeVue from './plugins/primevue'
import Firebase from './plugins/firebase'

// CSS
import '@/assets/main.scss'

const app = createApp(App)
app.use(Firebase)
app.use(PrimeVue)

app.use(router).mount('#app')
