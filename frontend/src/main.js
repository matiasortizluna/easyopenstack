import { createApp } from 'vue'
import './tailwind.css'
import './assets/css/style.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create a new store instance.
const store = createStore({
  state() {
    return {
    }
  },
  mutations: {

  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')