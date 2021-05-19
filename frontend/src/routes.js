import DashboardComponent from "./views/Dashboard.vue"
import NodesComponent from "./views/Nodes.vue"
import NamespacesComponent from "./views/Namespaces.vue"
import PodsComponent from "./views/Pods.vue"
import DeploymentsComponent from "./views/Deployments.vue"
import ServicesComponent from "./views/Services.vue"
import NotFound from './views/NotFound.vue'


/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: DashboardComponent, meta: { title: 'Dashboard' } },
  { path: '/nodes', component: NodesComponent, meta: { title: 'Nodes' } },
  { path: '/namespaces', component: NamespacesComponent, meta: { title: 'Namespaces' } },
  { path: '/pods', component: PodsComponent, meta: { title: 'Pods' } },
  { path: '/deployments', component: DeploymentsComponent, meta: { title: 'Deployments' } },
  { path: '/sevices', component: ServicesComponent, meta: { title: 'Services' } },
  { path: '/:path(.*)', component: NotFound },
]
