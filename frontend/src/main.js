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
      authToken: sessionStorage.getItem('authToken') || null,
      selectedProject: sessionStorage.getItem('selectedProject'),
      url: sessionStorage.getItem('url'),
      navbarItem: 'dashboard',
      virtualMachines: [],
      volumes: [],
      images: [],
    }
  },
  mutations: {
    setVirtualMachines(state, payload) {
      state.virtualMachines = payload
    },
    removeVirtualMachines(state) {
      state.virtualMachines = []
    },
    setVolumes(state, payload) {
      state.volumes = payload
    },
    removeVolumes(state) {
      state.volumes = []
    },
    setImages(state, payload) {
      state.images = payload
    },
    removeImages(state) {
      state.images = []
    },
    setNavBarItem(state, option) {
      state.navbarItem = option
    },
    setToken(state, token) {
      sessionStorage.setItem('authToken', token)
      state.authToken = token
    },
    removeToken(state) {
      sessionStorage.removeItem('authToken')
      state.authToken = null
    },
    setURL(state, url) {
      sessionStorage.setItem('url', url)
      state.url = url
    },
    removeURL(state) {
      sessionStorage.removeItem('url')
      state.url = null
    },
    setSelectedProject(state, project) {
      sessionStorage.setItem('selectedProject', project)
      state.selectedProject = project
    },
    removeSelectedProject(state) {
      sessionStorage.removeItem('selectedProject')
      state.selectedProject = null
    },
    logout(state) {
      state.authToken = null
      state.url = null
      state.selectedProject = null
      state.virtualMachines = []
      state.volumes = []
      state.images = []
      sessionStorage.clear()
    }
  }
})

app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.mount('#app')
