<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Dashboard</h3>
      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <router-link to="/nodes" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="computerPNG" width="50" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberNodes }}
                </h4>
                <div class="text-gray-600">Nodes</div>
              </div>
            </div>
          </router-link>
          <router-link to="/namespaces" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="namespacesPNG" width="67" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberNamespaces }}
                </h4>
                <div class="text-gray-500">Namespaces</div>
              </div>
            </div>
          </router-link>
          <router-link to="/pods" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="podsPNG" width="65" />
              </div>
              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberPods }}
                </h4>
                <div class="text-gray-500">Pods</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="mt-40">
        <div class="flex flex-wrap -mx-6">
          <router-link to="/deployments" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="deploymentsPNG" width="65" />
              </div>
              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberDeployments }}
                </h4>
                <div class="text-gray-500">Deployments</div>
              </div>
            </div>
          </router-link>
          <router-link to="/services" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="servicesPNG" width="65" />
              </div>
              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberServices }}
                </h4>
                <div class="text-gray-500">Services</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import computer from "../assets/images/computer.png";
import namespaces from "../assets/images/namespaces.png";
import pods from "../assets/images/pods.png";
//import deployments from "../assets/images/deployments.png";

export default {
  data() {
    return {
      computerPNG: computer,
      namespacesPNG: namespaces,
      podsPNG: pods,
  //    deploymentsPNG, deployments,
      numberNodes: "...",
      numberNamespaces: "...",
      numberPods: "...",
      numberDeployments: "...",
      numberServices: "...",
      error: ""
    };
  },
  methods: {
    getData(){
      axios.get("http://localhost:3000/api/nodes")
      .then((resp) => {
        this.numberNodes = resp.data.length
      })
      .catch(() => this.error = "Error requesting server! Check your connection.")
      axios.get("http://localhost:3000/api/namespaces")
      .then((resp) => {
        this.numberNamespaces = resp.data.length
      })
      .catch(() => this.error = "Error requesting server! Check your connection.")
      axios.get("http://localhost:3000/api/pods")
      .then((resp) => {
        this.numberPods = resp.data.length
      })
      .catch(() => this.error = "Error requesting server! Check your connection.")
      axios.get("http://localhost:3000/api/deployments")
      .then((resp) => {
        this.numberDeployments = resp.data.length
      })
      .catch(() => this.error = "Error requesting server! Check your connection.")
      axios.get("http://localhost:3000/api/services")
      .then((resp) => {
        this.numberServices = resp.data.length
      })
      .catch(() => this.error = "Error requesting server! Check your connection.")
    }
  },
  mounted() {
    this.getData()
  },
};
</script>
<style>
</style>