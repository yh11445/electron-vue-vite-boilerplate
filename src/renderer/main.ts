import { createApp } from 'vue'
import '@/styles/style.css'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'

const app = createApp(App)

app.use(vuetify)

app.mount('#app')
