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
      <i class="fas fa-fire-alt"></i>
      <span class="mx-3">Services</span>
    </router-link>
  </nav>
</template>
<script>
export default {};
</script>
