<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Namespaces</h3>
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
          <div class="col-md-3" v-for="namespace in namespaces" :key="namespace.metadata.uid">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="namespacesPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ namespace.metadata.name }}
                </h5>
                <p class="text-gray-700">
                  <strong>Created at: </strong>{{ formatDate(namespace.metadata.creationTimestamp) }}
                </p>
                <p class="text-gray-700">
                  <strong>Pods: </strong>{{ namespace.quant_pods }}
                </p>
                <p class="text-gray-700">
                  <strong>Deployments: </strong>{{ namespace.quant_deployments }}
                </p>
                <p class="text-gray-700">
                  <strong>Services: </strong>{{ namespace.quant_services }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ namespace.status.phase }}
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </main>
</template>
<script>
import namespaces from "../assets/images/namespaces.png";
export default {
  data() {
    return {
      namespacesPNG: namespaces,
      namespaces: [],
      errorMessage: "",
      message: "Loading...",
    };
  },
  methods: {
    getInfoNamespaces(){
      axios.get("http://localhost:3000/api/namespaces")
      .then((resp) => {
        //console.log(resp.data)
        this.namespaces = resp.data
        this.message = ""
      })
      .catch((err) => {
        this.message = ""
        this.errorMessage = err.response.data.message
      })
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    
  },
  mounted() {
    this.getInfoNamespaces();
  },
};
</script>
