import { createApp } from 'vue'
import './tailwind.css'
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
  state () {
    return {
      token: null,
      authToken: sessionStorage.getItem('authToken') || null,
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      sessionStorage.setItem('authToken', token)
    },
    removeToken(state){
      state.token=null,
      sessionStorage.removeItem('authToken')
    }
  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')
