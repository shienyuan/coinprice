import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Plugins
import Firebase from './plugins/firebase'
import PrimeVue from './plugins/primevue'
import LogRocket from './plugins/logrocket'
import Algolia from './plugins/algolia'

// CSS
import '@/assets/main.scss'

const app = createApp(App)
app.use(Firebase)
app.use(PrimeVue)
app.use(LogRocket)
app.use(Algolia)
app.use(router).mount('#app')
