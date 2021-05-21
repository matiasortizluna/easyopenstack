<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Deployments
        <button class="btn btn-info" @click="toggleModal()">
          Add <i class="far fa-plus-square"></i>
        </button>
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
          <div class="col-md-3 mb-3" v-for="deployment in deployments" :key="deployment.metadata.uid">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20 mb-3" :src="deploymentsPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ deployment.metadata.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  <strong>Namespace: </strong>{{ deployment.metadata.namespace }}
                </p>
                <p class="text-gray-700">
                  <strong>Running app: </strong>{{ deployment.metadata.labels.app }}
                </p>
                <p class="text-gray-700">
                  <strong>Strategy type: </strong>{{ deployment.spec.strategy.type }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Replicas: {{ deployment.status.replicas }}
                </div>
                <p class="text-gray-700">
                  <strong>Containers: </strong>{{ deployment.spec.template.spec.containers.length }}
                </p>
                <p class="text-gray-700">
                  <strong>Created at: </strong
                  >{{ formatDate(deployment.metadata.creationTimestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <!--<div
      class="modal fade"
      id="addVolumeModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addVolumeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addImageModalLabel">Add Volume</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              v-if="errorMessageModal"
              class="alert alert-danger text-center"
              role="alert"
            >
              {{ errorMessageModal }}
            </div>
            <div
              v-else-if="messageModal"
              class="alert alert-primary text-center"
              role="alert"
            >
              {{ messageModal }}
            </div>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Volume name"
                aria-label="Volume name"
                aria-describedby="basic-addon1"
                required
                v-model="volumeName"
              />
            </div>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Volume description"
                aria-label="Volume description"
                aria-describedby="basic-addon1"
                required
                v-model="volumeDescription"
              />
            </div>
            <label for="volume-source">Volume source</label>
            <br />
            <select name="volume-source" v-model="volumeSource">
              <option :value="null">No source, empty</option>
              <option v-for="image in images" :key="image.id" :value="image.id">
                Image: {{ image.name }}
              </option>
            </select>
            <div class="input-group mb-3 mt-3">
              <input
                type="number"
                class="form-control"
                placeholder="Size (GB)"
                aria-label="Size"
                aria-describedby="basic-addon1"
                required
                v-model="volumeSize"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" @click="addVolume()" class="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>-->
  </main>
</template>
<script>
import deployments from "../assets/images/deployments.png";
export default {
  data() {
    return {
      deploymentsPNG: deployments,
      deployments: [],
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
    };
  },

  methods: {
    getInfoDeployments(){
      axios.get("http://localhost:3000/api/deployments")
      .then((resp) => {
        //console.log(resp.data)
        this.message = ""
        this.deployments = resp.data
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
    toggleModal() {
      this.messageModal = "";
      this.errorMessageModal = "";
      this.volumeName = this.volumeDescription = this.volumeSource = this.volumeSize = null;
      $("#addVolumeModal").modal("toggle");
    },
  },
  mounted() {
    this.getInfoDeployments();
  },
};
</script>
