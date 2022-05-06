import { App } from 'vue'
import Config from 'primevue/config'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'

export default {
    install: (app: App): void => {
        app.use(Config)

        app.component('Button', Button)
        app.component('Card', Card)
        app.component('InputText', InputText)
    },
}
