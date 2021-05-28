<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Deployments
        <button class="btn btn-info mr-3" @click="toggleModal()">
          Create <i class="far fa-plus-square"></i>
        </button>
        <button class="btn btn-success" @click="toggleModalFastCreate()">
          Fast create <i class="far fa-plus-square"></i>
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
                  <strong>Label: </strong
                  >{{
                    deployment.metadata.labels
                      ? deployment.metadata.labels["k8s-app"] ?? deployment.metadata.labels["app"]
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
      id="createDeploymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createDeploymentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createDeploymentLabel">Create Deployment</h5>
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
              @click="createDeployment()"
              class="btn btn-primary"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Fast Create -->
    <div
      class="modal fade"
      id="fastCreateDeploymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createDeploymentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createDeploymentLabel">Deployment fast creation</h5>
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
              Fill the fields to create a deployment easily
            </p>
            <br />
            <div class="row mb-3">
                <div class="col">
                  <label for="depolyment-name">Deployment name</label>
                  <input v-model="fastDeployment.name" type="text" class="form-control" id="deployment-name" placeholder="Enter deployment name">
                </div>
                <div class="col">
                  <label for="namespace">Namespace</label>
                  <select v-model="fastDeployment.namespace" name="namespace" id="namespace" class="form-control">
                    <option v-for="namespace in namespaces" :key="namespace.metadata.name" :value="namespace.metadata.name">
                      {{ namespace.metadata.name }}
                    </option>
                  </select>
                </div>
            </div>
            <div class="row">
                <div class="col">
                  <label for="label">Label</label>
                  <input v-model="fastDeployment.label" type="text" class="form-control" id="label" placeholder="Enter label for the containers and deployment">
                  <small class="form-text text-muted">Label used to identify the containers if this deployment.</small>
                </div>
                <div class="col">
                  <label for="image-name">Image name</label>
                  <input v-model="fastDeployment.image" type="text" class="form-control" id="image-name" placeholder="Enter the image name to use in the containers">
                  <small class="form-text text-muted">Image name for the containers. Must be the exact name!</small>
                </div>
            </div>
            <div class="row">
                <div class="col">
                  <label for="replicas">Replicas</label>
                  <input v-model="fastDeployment.replicas" type="number" class="form-control" id="replicas">
                </div>
                <div class="col">
                  <label for="port">Port to expose</label>
                  <input v-model="fastDeployment.port" type="number" class="form-control" id="port">
                  <small class="form-text text-muted">Select "0" if no port needed</small>
                </div>
            </div>
            <div class="form-check mt-3">
              <input v-model="fastDeployment.createService" type="checkbox" class="form-check-input" id="create-service-check">
              <label class="form-check-label" for="create-service-check">Create a service associated with the pods of this deployment</label>
            </div>
            <div class="row" v-show="fastDeployment.createService">
              <div class="col">
                  <label for="protocol">Protocol</label>
                  <select v-model="fastDeployment.protocol" name="protocol" id="protocol" class="form-control">
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                  </select>
                </div>
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
              @click="fastCreateDeployment()"
              class="btn btn-primary"
            >
              Create
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
      namespaces: [],
      fastDeployment: {
        name: "",
        namespace: "",
        label: "",
        image: "",
        replicas: 1,
        port: 0,
        createService: false,
        protocol: "TCP",
      }
    };
  },

  methods: {
    getInfoDeployments() {
      axios
        .get("http://localhost:3000/api/deployments")
        .then((resp) => {
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
      this.selectedFile = null
      $("#createDeploymentModal").modal("toggle");
    },
    toggleModalFastCreate() {
      this.messageModal = "Loading...";
      this.errorMessageModal = "";
      this.fastDeployment.name = this.fastDeployment.namespace = this.fastDeployment.label = this.fastDeployment.image = null
      this.fastDeployment.replicas = 1
      this.fastDeployment.port = 0
      this.fastDeployment.createService = false
      axios.get("http://localhost:3000/api/namespaces")
      .then((resp) => {
        this.namespaces = resp.data
        this.messageModal = ""
      })
      .catch(() => this.errorMessageModal = "Error while fetching namespaces.")
      $("#fastCreateDeploymentModal").modal("toggle");
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
            this.getInfoDeployments();
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
    createDeployment() {
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
    fastCreateDeployment(){
      this.errorMessageModal = ""
      if(!this.fastDeployment.name || !this.fastDeployment.namespace || !this.fastDeployment.label || !this.fastDeployment.image)
        return this.errorMessageModal = "All fields are required!"
      if(this.fastDeployment.replicas < 1 || this.fastDeployment.port < 0)
        return this.errorMessageModal = "Replica's quantity must be greater than zero and the Port number must be zero or greater!"
      this.messageModal = "Creating Deployment..."
      let deployment = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          name: this.fastDeployment.name,
          namespace: this.fastDeployment.namespace,
          labels: {
            app: this.fastDeployment.label
          }
        },
        spec: {
          replicas: this.fastDeployment.replicas,
          selector: {
            matchLabels: {
              app: this.fastDeployment.label
            }
          },
          template: {
            metadata: {
              labels: {
                app: this.fastDeployment.label
              }
            },
            spec: {
              containers: [
                {
                  name: this.fastDeployment.label,
                  image: this.fastDeployment.image
                }
              ]
            }
          } 
        }
      }
      if (this.fastDeployment.port > 0){
        deployment.spec.template.spec.containers[0].ports = [
         {
           containerPort: parseInt(this.fastDeployment.port)
         }
        ]
      }
      axios.post("http://localhost:3000/api/deployments/fast", {"deployment": deployment, "service": { create_service: this.fastDeployment.createService, protocol: this.fastDeployment.protocol, port: this.fastDeployment.port}})
      .then(() => {
        this.message = "Deployment created successfully!"
        this.toggleModalFastCreate()
        this.getInfoDeployments()
      })
      .catch((err) => {
        this.messageModal = ""
        this.errorMessageModal = err.response.data.message
      })
    },
  },
  mounted() {
    this.getInfoDeployments();
  },
};
</script>
