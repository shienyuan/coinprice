import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Cryptoicon from 'vue-cryptoicon'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import icons from 'vue-cryptoicon/src/icons'
Cryptoicon.add()
import PrimeVue from 'primevue/config'

const app = createApp(App)
app.use(Cryptoicon)

app.use(PrimeVue)

app.use(router).mount('#app')
