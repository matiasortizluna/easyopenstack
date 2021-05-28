<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Services
        <button class="btn btn-info" @click="toggleModal()">
          Create <i class="far fa-plus-square"></i>
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
            v-for="service in services"
            :key="service.metadata.uid"
          >
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img
                  class="rounded mx-auto d-block w-20 mb-3"
                  :src="servicesPNG"
                />
                <h5 class="card-title text-center font-weight-bold">
                  {{ service.metadata.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  <strong>Namespace: </strong>{{ service.metadata.namespace }}
                </p>

                <p class="text-gray-700">
                  <strong>Component: </strong
                  >{{
                    service.metadata.labels
                      ? service.metadata.labels.component
                      : "--"
                  }}
                </p>
                <p class="text-gray-700">
                  <strong>Provider: </strong
                  >{{
                    service.metadata.labels
                      ? service.metadata.labels.provider
                      : "---"
                  }}
                </p>
                <p class="text-gray-700">
                  <strong>Type: </strong
                  >{{
                    service.spec.type
                  }}
                </p>
                <div class="text-gray-700">
                  <strong>Selectors: </strong>
                  <p v-for="selector,key in service.spec.selector" :key="selector">
                    &nbsp;&nbsp;&nbsp;&nbsp;{{
                      key+ ": " + selector
                    }}
                  </p>
                </div>
                <p class="text-gray-700">
                  <strong>Cluster IP: </strong>{{ service.spec.clusterIP }}
                </p>
                <div class="text-gray-700">
                  <strong>Ports:</strong>
                  <div class="ml-10" v-for="port in service.spec.ports" :key="port.port">
                      <p>Containers: {{port.targetPort}}, {{port.protocol}} </p>
                      <p>Internal (Cluster): {{port.port}}, {{port.protocol}} </p>
                      <p v-show="port.nodePort">External (Node): {{ port.nodePort }}, {{port.protocol}} </p>
                  </div>
                </div>
                <p class="text-gray-700">
                  <strong>Created at: </strong
                  >{{ formatDate(service.metadata.creationTimestamp) }}
                </p>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col">
                   <!-- <button type="button" class="btn btn-warning">Edit</button
                    >&nbsp;&nbsp;-->
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deleteService(service)"
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
      id="createServiceModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createServiceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createServiceLabel">create Service</h5>
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
            <p>Select the YAML file that contains the Service Configuration</p>
            <br />
            <div class="input-group mb-3">
              <input
                type="file"
                class="form-control"
                placeholder="Service config file"
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
            <button type="button" @click="createService()" class="btn btn-primary">
              create
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import services from "../assets/images/services.png";
export default {
  data() {
    return {
      servicesPNG: services,
      services: [],
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
      selectedFile: null,
    };
  },
  methods: {
    getInfoservices() {
      axios
        .get("http://localhost:3000/api/services")
        .then((resp) => {
          console.log(resp.data)
          this.message = "";
          this.services = resp.data;
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
      $("#createServiceModal").modal("toggle");
    },
    selectFile(event) {
      this.selectedFile = event.target.files[0];
    },
    deleteService(service) {
      console.log(service.metadata);

      axios
        .delete(
          "http://localhost:3000/api/services/" +
            service.metadata.namespace +
            "/" +
            service.metadata.name
        )
        .then((resp) => {
          console.log(resp.data);
          this.message = "Deleting Service, please wait 3 seconds";
          setTimeout(() => {
            this.getInfoservices();
            setTimeout(() => {
              this.message = "Service deleted Sucessfully";
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
    createService() {
      this.errorMessageModal = "";
      if (!this.selectedFile)
        return (this.errorMessageModal = "Please select a file!");
      this.messageModal = "Creating Service...";
      let formData = new FormData();
      formData.append("service_configfile", this.selectedFile);
      axios
        .post("http://localhost:3000/api/services", formData)
        .then((resp) => {
          this.services.push(resp.data);
          this.message = "Service created successfully!";
          this.toggleModal();
        })
        .catch((err) => {
          this.errorMessageModal = err.response.data.message;
        });
    },
  },
  mounted() {
    this.getInfoservices();
  },
};
</script>
