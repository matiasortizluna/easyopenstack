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
                      ? deployment.metadata.labels["k8s-app"] ??
                        deployment.metadata.labels["app"]
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
                    <button
                      type="button"
                      class="btn btn-warning"
                      @click="toggleUpdateDeploymentModal(deployment)"
                    >
                      Edit</button
                    >&nbsp;&nbsp;
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
    <!-- Modal Create Deployment-->
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
            <h5 class="modal-title" id="createDeploymentLabel">
              Create Deployment
            </h5>
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
            <div>
              <img :src="deployments_examplePNG" width="300" />
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

    <!-- Modal Patch Deployment -->
    <div
      class="modal fade"
      id="updateDeploymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="updateDeploymentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateDeploymentLabel">
              Deployment fast creation
            </h5>
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
            <br />
            <div class="row mb-3">
              <div class="col">
                <label for="depolyment-name">Deployment Name</label>
                <input
                  v-model="selectedDeployment.metadata.name"
                  type="text"
                  class="form-control"
                  id="deployment-name"
                  disabled
                />
              </div>
              <div class="col">
                <label for="depolyment-namespace">Deployment Namespace</label>
                <input
                  v-model="selectedDeployment.metadata.namespace"
                  type="text"
                  class="form-control"
                  id="deployment-namespace"
                  disabled
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="deployment_labels">Deployment Labels</label>
                <br />
                <div
                  v-for="label in deployments_labels.before"
                  v-bind:key="label"
                  class="form-check form-check-inline"
                  :value="label"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    v-model="deployments_labels.before"
                    checked
                    disabled
                  />
                  <label class="form-check-label" for="inlineCheckbox1">{{
                    label
                  }}</label>
                </div>
                <div>
                  <input
                    v-model="deployments_labels.new"
                    type="text"
                    class="form-control"
                    id="deployment-label"
                    placeholder="New Deployment Label"
                  />
                </div>
              </div>
              <div class="col">
                <label for="stategy_type">Strategy Type</label>
                <select
                  v-model="selectedDeployment.spec.strategy.type"
                  name="strategy"
                  id="strategy"
                  class="form-control"
                >
                  <option value="Canary">Canary</option>
                  <option value="RollingUpdate">Rolling Update</option>
                </select>
                <br />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="replicas_labels">Replicas Labels</label>
                <br />
                <div
                  v-for="label in replicas_labels.before"
                  v-bind:key="label"
                  class="form-check form-check-inline"
                  :value="label"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    v-model="replicas_labels.new"
                  />
                  <label class="form-check-label" for="inlineCheckbox1">{{
                    label
                  }}</label>
                </div>
                <div>
                  <input
                    v-model="replicas_labels.new"
                    type="text"
                    class="form-control"
                    id="replicas-label"
                    placeholder="New Replicas Label"
                    disabled
                  />
                </div>
              </div>
              <div class="col">
                <label for="replicas">Replicas</label>
                <input
                  v-model="selectedDeployment.spec.replicas"
                  type="number"
                  class="form-control"
                  id="replicas"
                />
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
              @click="updateDeployment()"
              class="btn btn-primary"
            >
              Update
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
            <h5 class="modal-title" id="createDeploymentLabel">
              Deployment fast creation
            </h5>
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
            <p>Fill the fields to create a deployment easily</p>
            <br />
            <div class="row mb-3">
              <div class="col">
                <label for="depolyment-name">Deployment name</label>
                <input
                  v-model="fastDeployment.name"
                  type="text"
                  class="form-control"
                  id="deployment-name"
                  placeholder="Enter deployment name"
                />
              </div>
              <div class="col">
                <label for="namespace">Namespace</label>
                <select
                  v-model="fastDeployment.namespace"
                  name="namespace"
                  id="namespace"
                  class="form-control"
                >
                  <option
                    v-for="namespace in namespaces"
                    :key="namespace.metadata.name"
                    :value="namespace.metadata.name"
                  >
                    {{ namespace.metadata.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="label">Label</label>
                <input
                  v-model="fastDeployment.label"
                  type="text"
                  class="form-control"
                  id="label"
                  placeholder="Enter label for the containers and deployment"
                />
                <small class="form-text text-muted"
                  >Label used to identify the containers if this
                  deployment.</small
                >
              </div>
              <div class="col">
                <label for="image-name">Image name</label>
                <input
                  v-model="fastDeployment.image"
                  type="text"
                  class="form-control"
                  id="image-name"
                  placeholder="Enter the image name to use in the containers"
                />
                <small class="form-text text-muted"
                  >Image name for the containers. Must be the exact name!</small
                >
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="replicas">Replicas</label>
                <input
                  v-model="fastDeployment.replicas"
                  type="number"
                  class="form-control"
                  id="replicas"
                />
              </div>
              <div class="col">
                <label for="port">Port to expose</label>
                <input
                  v-model="fastDeployment.port"
                  type="number"
                  class="form-control"
                  id="port"
                />
                <small class="form-text text-muted"
                  >Select "0" if no port needed</small
                >
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="strategy_deployment">Strategy Type</label>
                <select
                  v-model="fastCreateDeployment.strategy_type"
                  name="strategy_deployment"
                  id="strategy_deployment"
                  class="form-control"
                >
                  <option value="Canary">Canary</option>
                  <option value="RollingUpdate">Rolling Update</option>
                </select>
                <br />
              </div>
            </div>
            <div class="form-check mt-3">
              <input
                v-model="fastDeployment.createService"
                type="checkbox"
                class="form-check-input"
                id="create-service-check"
              />
              <label class="form-check-label" for="create-service-check"
                >Create a service associated with the pods of this
                deployment</label
              >
            </div>
            <template v-if="fastDeployment.createService">
              <div class="row">
                <div class="col">
                  <label for="protocol">Protocol</label>
                  <select
                    v-model="fastDeployment.protocol"
                    name="protocol"
                    id="protocol"
                    class="form-control"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                  </select>
                </div>
                <div class="col">
                  <label for="service-type">Service Type</label>
                  <select
                    v-model="fastDeployment.serviceType"
                    name="service-type"
                    id="service-type"
                    class="form-control"
                  >
                    <option value="ClusterIP">Cluster IP (Internal)</option>
                    <option value="NodePort">NodePort (External)</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="service-port">Service port</label>
                  <input
                    v-model="fastDeployment.servicePort"
                    type="number"
                    class="form-control"
                    id="servicePort"
                  />
                </div>
              </div>
            </template>
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
import deployments_example from "../assets/images/deployments_example.png";
export default {
  data() {
    return {
      deploymentsPNG: deployments,
      deployments_examplePNG: deployments_example,
      deployments: [],
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
      selectedFile: null,
      namespaces: [],
      deployments_labels: { before: {}, new: [] },
      replicas_labels: { before: {}, new: [] },
      fastDeployment: {
        name: "",
        namespace: "",
        label: "",
        image: "",
        replicas: 1,
        port: 0,
        createService: false,
        protocol: "TCP",
        serviceType: "NodePort",
        servicePort: 80,
        strategy_type: "Recreate",
      },
      selectedDeployment: {
        apiVersion: "",
        kind: "",
        metadata: {
          name: "",
          namespace: "",
          labels: {
            app: "",
            other: "",
            another: "",
          },
        },
        spec: {
          strategy: {
            type: "",
          },
          replicas: 0,
          selector: {
            matchLabels: {
              app: "",
              other: "",
              another: "",
            },
          },
          template: {
            metadata: {
              labels: {
                app: "",
                other: "",
                another: "",
              },
            },
            spec: {
              containers: [
                {
                  name: "",
                  image: "",
                },
              ],
            },
          },
        },
      },
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
      this.selectedFile = null;
      $("#createDeploymentModal").modal("toggle");
    },
    toggleUpdateDeploymentModal(deployment) {
      this.messageModal = "Loading...";
      this.errorMessageModal = "";
      if (deployment) {
        this.selectedDeployment = deployment;
        this.deployments_labels.before = deployment.metadata.labels;
        this.replicas_labels.before = deployment.spec.selector.matchLabels;
      }
      $("#updateDeploymentModal").modal("toggle");
      this.messageModal = "";
    },
    toggleModalFastCreate() {
      this.messageModal = "Loading...";
      this.errorMessageModal = "";
      this.fastDeployment.name =
        this.fastDeployment.namespace =
        this.fastDeployment.label =
        this.fastDeployment.image =
          null;
      this.fastDeployment.replicas = 1;
      this.fastDeployment.port = 0;
      this.fastDeployment.createService = false;
      axios
        .get("http://localhost:3000/api/namespaces")
        .then((resp) => {
          this.namespaces = resp.data;
          this.messageModal = "";
        })
        .catch(
          () => (this.errorMessageModal = "Error while fetching namespaces.")
        );
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
          this.getInfoDeployments();

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
    updateDeployment() {
      this.errorMessageModal = "";
      if (this.selectedDeployment.spec.replicas < 1)
        return (this.errorMessageModal =
          "Replica's quantity must be greater than zero and the Port number must be zero or greater!");

      // Update Replicas type to Int
      this.selectedDeployment.spec.replicas = parseInt(
        this.selectedDeployment.spec.replicas
      );

      // Add new labels to replicas
      if (this.replicas_labels.new.length > 1) {
        this.selectedDeployment.spec.selector.matchLabels[
          this.replicas_labels.new
        ] = this.replicas_labels.new;
        this.selectedDeployment.spec.selector.template.metadata.labels[
          this.replicas_labels.new
        ] = this.replicas_labels.new;
      }

      // Add new labels to deployment
      if (this.deployments_labels.new.length > 1) {
        this.selectedDeployment.metadata.labels[this.deployments_labels.new] =
          this.deployments_labels.new;
      }

      //Change Strategy Type
      switch (this.selectedDeployment.spec.strategy.type) {
        case "Canary":
          break;
        case "RollingUpdate":
          this.selectedDeployment.spec.strategy = {
            rollingUpdate: { maxSurge: "25%", maxUnavailable: "25%" },
            type: "RollingUpdate",
          };
          break;
        case "Recreate":
          if (this.selectedDeployment.spec.strategy.rollingUpdate != null) {
            this.selectedDeployment.spec.strategy.rollingUpdate = null;
          }
          this.selectedDeployment.spec.strategy.type = "Recreate";
          break;
      }

      console.log("selectedDeploymen");
      console.log(this.selectedDeployment);

      let depoyment_to_update = this.selectedDeployment;
      axios
        .patch(
          "http://localhost:3000/api/deployments/" +
            this.selectedDeployment.metadata.namespace +
            "/" +
            this.selectedDeployment.metadata.name,
          {
            depoyment_to_update,
          }
        )
        .then((res) => {
          console.log("REsult");
          console.log(res);
          this.message = "Deployment Updated successfully!";
          this.toggleUpdateDeploymentModal();
          setTimeout(() => {
            this.getInfoDeployments();
          }, 1000);
        })
        .catch((err) => {
          this.messageModal = "";
          this.errorMessageModal = err.response.data.message;
        });
    },
    fastCreateDeployment() {
      this.errorMessageModal = "";
      if (
        !this.fastDeployment.name ||
        !this.fastDeployment.namespace ||
        !this.fastDeployment.label ||
        !this.fastDeployment.image ||
        !this.fastCreateDeployment.strategy_type
      )
        return (this.errorMessageModal = "All fields are required!");
      if (this.fastDeployment.replicas < 1 || this.fastDeployment.port < 0)
        return (this.errorMessageModal =
          "Replica's quantity must be greater than zero and the Port number must be zero or greater!");
      if (this.fastDeployment.createService) {
        if (this.fastDeployment.servicePort < 1)
          return (this.errorMessageModal =
            "Service port must be greater than 0!");
      }
      switch (this.fastDeployment.strategy_type) {
        case "RollingUpdate":
          this.fastDeployment.strategy_type = {
            rollingUpdate: { maxSurge: "25%", maxUnavailable: "25%" },
            type: "RollingUpdate",
          };
          break;
        case "Recreate":
          this.fastDeployment.strategy_type = { type: "Recreate" };
          break;
      }

      this.messageModal = "Creating Deployment...";
      let deployment = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          name: this.fastDeployment.name,
          namespace: this.fastDeployment.namespace,
          labels: {
            app: this.fastDeployment.label,
          },
        },
        spec: {
          strategy: this.fastDeployment.strategy_type,
          replicas: this.fastDeployment.replicas,
          selector: {
            matchLabels: {
              app: this.fastDeployment.label,
            },
          },
          template: {
            metadata: {
              labels: {
                app: this.fastDeployment.label,
              },
            },
            spec: {
              containers: [
                {
                  name: this.fastDeployment.label,
                  image: this.fastDeployment.image,
                },
              ],
            },
          },
        },
      };
      if (this.fastDeployment.port > 0) {
        deployment.spec.template.spec.containers[0].ports = [
          {
            containerPort: parseInt(this.fastDeployment.port),
          },
        ];
      }
      let service = {
        create_service: this.fastDeployment.createService,
        protocol: this.fastDeployment.protocol,
        port: this.fastDeployment.port,
        service_type: this.fastDeployment.serviceType,
        service_port: this.fastDeployment.servicePort,
      };
      axios
        .post("http://localhost:3000/api/deployments/fast", {
          deployment: deployment,
          service: service,
        })
        .then(() => {
          this.message = "Deployment created successfully!";
          this.toggleModalFastCreate();
          this.getInfoDeployments();
        })
        .catch((err) => {
          this.messageModal = "";
          this.errorMessageModal = err.response.data.message;
        });
    },
    cleanSelectedDeployment() {
      this.selectedDeployment = {
        apiVersion: "",
        kind: "",
        metadata: {
          name: "",
          namespace: "",
          labels: {
            app: "",
            other: "",
            another: "",
          },
        },
        spec: {
          replicas: 0,
          selector: {
            matchLabels: {
              app: "",
              other: "",
              another: "",
            },
          },
          template: {
            metadata: {
              labels: {
                app: "",
                other: "",
                another: "",
              },
            },
            spec: {
              containers: [
                {
                  name: "",
                  image: "",
                },
              ],
            },
          },
        },
      };
    },
  },
  mounted() {
    this.getInfoDeployments();
  },
};
</script>
