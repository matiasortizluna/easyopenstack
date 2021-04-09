import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create a new store instance.
const store = createStore({
  state () {
    return {
      token: null
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    }
  }
})


app.use(store)
app.use(router)
app.mount('#app')
