import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons'
// import 'bootstrap/dist/css/bootstrap.min.css'
const pinia = createPinia();
createApp(App).use(router).use(Quasar, { config: {extras: [
  'material-icons', // 預設
  // 'fontawesome-v6',
  // 'mdi-v7',
],}}).use(pinia).mount('#app')
