import DashboardComponent from "./views/Dashboard.vue"
import DeployComponent from "./views/Deploy.vue"
import ImagesComponent from "./views/Images.vue"
import ConnectComponent from "./views/Connect.vue"
import VirtualMachinesComponent from "./views/VirtualMachines.vue"
import VolumesComponent from "./views/Volumes.vue"
import NewServiceComponent from "./views/NewService.vue"
import NotFound from './views/NotFound.vue'


/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  //{ path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/', component: DashboardComponent, meta: { title: 'Dashboard' } },
  { path: '/deploy', component: DeployComponent, meta: { title: 'Deploy' } },
  { path: '/images', component: ImagesComponent, meta: { title: 'Images' } },
  { path: '/connect', component: ConnectComponent, meta: { title: 'Connect' } },
  { path: '/vm', component: VirtualMachinesComponent, meta: { title: 'Virtual Machines' } },
  { path: '/volumes', component: VolumesComponent, meta: { title: 'Volumes' } },
  { path: '/new', component: NewServiceComponent, meta: { title: 'New Service' } },
  { path: '/:path(.*)', component: NotFound },
]
