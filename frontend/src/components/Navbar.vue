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
      to="/deploy"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-plus"></i>
      <span class="mx-3">Deploy</span>
    </router-link>

    <router-link
      to="/vm"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-server"></i>
      <span class="mx-3">Virtual Machines</span>
    </router-link>

    <router-link
      to="/volumes"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-database"></i>
      <span class="mx-3">Volumes</span>
    </router-link>

    <router-link
      to="/images"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-compact-disc"></i>
      <span class="mx-3">Images</span>
    </router-link>
    <router-link
      to="/new"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <i class="fas fa-fire-alt"></i>
      <span class="mx-3">Plugin - Heat</span>
    </router-link>
    <router-link
      to="/connect"
      class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
    >
      <svg
        class="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
        ></path>
      </svg>

      <span class="mx-3">Connect</span>
    </router-link>
  </nav>
</template>
<script>
export default {};
</script>
