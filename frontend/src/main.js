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
  state() {
    return {
      authToken: localStorage.getItem('authToken') || null,
      selectedProject: localStorage.getItem('selectedProject'),
      url: localStorage.getItem('url')
    }
  },
  mutations: {
    setToken(state, token) {
      localStorage.setItem('authToken', token)
    },
    removeToken(state) {
      localStorage.removeItem('authToken')
      localStorage.clear()
    },
    setURL(state, url) {
      localStorage.setItem('url', url)
    },
    removeURL(state) {
      localStorage.removeItem('url')
    },
    setSelectedProject(state, project) {
      localStorage.setItem('selectedProject', project)
      //localStorage.setItem('selectedProject', 'demo')
    },
    removeSelectedProject(state) {
      localStorage.removeItem('selectedProject')
    }
  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')
