import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import 'bootstrap/dist/css/bootstrap.min.css'
const pinia = createPinia();
createApp(App).use(router).use(Quasar).use(pinia).mount('#app')
