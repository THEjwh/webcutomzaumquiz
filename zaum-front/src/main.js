import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as Colyseus from "colyseus.js";
import axios from 'axios'
import vueAxios from 'vue-axios'
import './index.css'

const app = createApp(App)

app.use(router)
app.use(vueAxios, axios)
app.config.globalProperties.$colyseus = Colyseus

app.mount('#app')
