<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Nodes
      </h3>

      <br />

      <div class="mt-4">
        <div
          v-if="errorMessage"
          class="alert alert-danger text-center"
          role="alert"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="message"
          class="alert alert-primary text-center"
          role="alert"
        >
          {{ message }}
        </div>
        <div class="row">
          <div class="col-md-3" v-for="node in nodes" :key="node.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img
                  class="rounded mx-auto d-block w-20"
                  :src="serverPNG"
                />
                
                <h5 class="card-title text-center font-weight-bold">
                  {{ node.metadata.name }}
                </h5>
                <div class="text-black-800 font-weight-bold">
                  UID: {{ node.metadata.uid }}
                </div>
                <p class="mt-2 text-gray-700">
                  Allocatable CPUs: {{ node.status.allocatable.cpu }}
                </p>
                <p class="text-gray-700">
                  Allocatable storage: {{ (parseInt(node.status.allocatable["ephemeral-storage"])/1000000).toFixed(2) }} GB
                </p>
                <p class="text-gray-700">
                  Allocatable RAM {{ (parseInt(node.status.allocatable.memory)/1000000).toFixed(2) }} GB
                </p>
                <p class="text-gray-700">
                  Capacity of pods: {{ node.status.allocatable.pods }}
                </p>
                <div class="text-black-700">
                  Images on the node: {{ node.status.images.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import server from "../assets/images/server.png";
export default {
  data() {
    return {
      serverPNG: server,
      nodes: null,
      errorMessage: "",
      message: "Loading...",
    };
  },
  methods: {
    getNodes(){
      axios.get("http://localhost:3000/api/nodes")
      .then((resp) => {
        this.nodes = resp.data
        console.log(resp.data)
        this.message = ""
      })
    }
  },
  mounted() {
    this.getNodes()
  },
};
</script>