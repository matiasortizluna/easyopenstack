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
          <div
            class="col-md-3 mb-3"
            v-for="deployment in deployments"
            :key="deployment.metadata.uid"
          >
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img
                  class="rounded mx-auto d-block w-20 mb-3"
                  :src="deploymentsPNG"
                />
                <h5 class="card-title text-center font-weight-bold">
                  {{ deployment.metadata.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  <strong>Namespace: </strong
                  >{{ deployment.metadata.namespace }}
                </p>

                <p class="text-gray-700">
                  <strong>Running app: </strong
                  >{{
                    deployment.metadata.labels
                      ? deployment.metadata.labels["k8s-app"]
                      : "---"
                  }}
                </p>
                <p class="text-gray-700">
                  <strong>Strategy type: </strong
                  >{{ deployment.spec.strategy.type }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Replicas: {{ deployment.status.replicas }}
                </div>
                <p class="text-gray-700">
                  <strong>Containers: </strong
                  >{{ deployment.spec.template.spec.containers.length }}
                </p>
                <p class="text-gray-700">
                  <strong>Created at: </strong
                  >{{ formatDate(deployment.metadata.creationTimestamp) }}
                </p>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col">
                    <button type="button" class="btn btn-warning">Edit</button>&nbsp;&nbsp;
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deleteDeployment(deployment)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addDeploymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addDeploymentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addDeploymentLabel">Add Deployment</h5>
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
            <p>
              Select the YAML file that contains the Deployment Configuration
            </p>
            <br />
            <div class="input-group mb-3">
              <input
                type="file"
                class="form-control"
                placeholder="Deployment config file"
                required
                @change="selectFile($event)"
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
            <button
              type="button"
              @click="addDeployment()"
              class="btn btn-primary"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
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
      selectedFile: null,
    };
  },

  methods: {
    getInfoDeployments() {
      axios
        .get("http://localhost:3000/api/deployments")
        .then((resp) => {
          console.log(resp.data);
          this.message = "";
          this.deployments = resp.data;
        })
        .catch((err) => {
          this.message = "";
          this.errorMessage = err.response.data.message;
        });
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    toggleModal() {
      this.messageModal = "";
      this.errorMessageModal = "";
      this.volumeName = this.volumeDescription = this.volumeSource = this.volumeSize = null;
      $("#addDeploymentModal").modal("toggle");
    },
    selectFile(event) {
      this.selectedFile = event.target.files[0];
    },
    deleteDeployment(deployment) {
      //console.log(deployment.metadata);
      this.message = "Deleting Deployment";
      axios
        .delete(
          "http://localhost:3000/api/deployments/" +
            deployment.metadata.namespace +
            "/" +
            deployment.metadata.name
        )
        .then((resp) => {
          //console.log(resp.data);
          this.getInfoDeployments()

          this.message = "Deleting Deployment, please wait 3 seconds";
          setTimeout(() => {
            this.getNodes();
            setTimeout(() => {
              this.message = "Deployment deleted Sucessfully";
            }, 1000);
          }, 3000);
        })
        .catch((err) => {
          this.message = "";
          this.errorMessage = err.response.data.message.body
            ? "Error " +
              err.response.data.message.body.code +
              ": " +
              err.response.data.message.body.message
            : err.response.data.message;
        });
    },
    addDeployment() {
      this.errorMessageModal = "";
      if (!this.selectedFile)
        return (this.errorMessageModal = "Please select a file!");
      this.messageModal = "Creating Deployment...";
      let formData = new FormData();
      formData.append("deployment_configfile", this.selectedFile);
      axios
        .post("http://localhost:3000/api/deployments", formData)
        .then((resp) => {
          this.deployments.push(resp.data);
          this.message = "Deployment created successfully!";
          this.toggleModal();
        })
        .catch((err) => {
          this.errorMessageModal = err.response.data.message;
        });
    },
  },
  mounted() {
    this.getInfoDeployments();
  },
};
</script>
