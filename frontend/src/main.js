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
      authToken: sessionStorage.getItem('authToken') || null,
      selectedProject: sessionStorage.getItem('selectedProject'),
      url: sessionStorage.getItem('url'),
      selectedProjectName: '',
      ip_address: sessionStorage.getItem('ip_address') || '',
    }
  },
  mutations: {
    setToken(state, token) {
      sessionStorage.setItem('authToken', token)
      state.authToken = token
    },
    setIP(state, ip) {
      sessionStorage.setItem('ip_address', ip)
      state.ip_address = ip;
    },
    setURL(state, url) {
      sessionStorage.setItem('url', url)
      state.url = url
    },
    setSelectedProject(state, project) {
      sessionStorage.setItem('selectedProject', project)
      state.selectedProject = project
    },
    setSelectedProjectName(state, project) {
      state.selectedProjectName = project
    },
    removeToken(state) {
      sessionStorage.removeItem('authToken')
      state.authToken = null
    },
    removeIP(state, ip) {
      sessionStorage.removeItem('ip_address', ip)
      state.ip_address = '';
    },
    removeURL(state) {
      sessionStorage.removeItem('url')
      state.url = null
    },
    removeSelectedProject(state) {
      sessionStorage.removeItem('selectedProject')
      state.selectedProject = null
    },
    removeSelectedProjectName(state) {
      state.selectedProjectName = ''
    },
    logout(state) {
      state.authToken = null
      state.url = null
      state.selectedProject = ''
      state.selectedProjectName = ''
      state.ip_address = ''
      sessionStorage.clear()
    }
  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')