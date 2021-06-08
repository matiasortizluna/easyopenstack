<template>
  <nav class="mt-10">
    <!-- class="flex items-center mt-4 py-2 px-6 bg-gray-700 bg-opacity-25 text-gray-100" -->
    <router-link
      to="/"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-chart-pie"></i>
      <span class="mx-3">Dashboard</span>
    </router-link>
    <router-link
      to="/nodes"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-server"></i>
      <span class="mx-3">Nodes</span>
    </router-link>

    <router-link
      to="/namespaces"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-sitemap"></i>
      <span class="mx-3">Namespaces</span>
    </router-link>

    <router-link
      to="/pods"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-th"></i>
      <span class="mx-3">Pods</span>
    </router-link>

    <router-link
      to="/deployments"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-rocket"></i>
      <span class="mx-3">Deployments</span>
    </router-link>
    <router-link
      to="/services"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-cogs"></i>
      <span class="mx-3">Services</span>
    </router-link>
    <a v-if="grafanaUrl" :href="grafanaUrl" class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" target="_blank">
      <i class="fas fa-cogs"></i>
      <span class="mx-3">Monitoring</span>
    </a>
  </nav>
</template>
<script>
export default {
  data(){
    return {
      grafanaUrl: null,
    }
  },
  mounted(){
    axios.get("http://localhost:3000/api/grafana/link")
    .then((resp) => this.grafanaUrl = resp.data)
    .catch((err) => {
      console.log(err.response.data)
      this.grafanaUrl = null
    })
  }
};
</script>
