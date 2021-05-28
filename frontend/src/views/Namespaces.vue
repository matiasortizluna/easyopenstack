<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Namespaces</h3>
      <button class="btn btn-info" @click="toggleModal()">
        Create <i class="far fa-plus-square"></i>
      </button>
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
            class="col-md-3"
            v-for="namespace in namespaces"
            :key="namespace.metadata.uid"
          >
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img
                  class="rounded mx-auto d-block w-20"
                  :src="namespacesPNG"
                />
                <h5 class="card-title text-center font-weight-bold">
                  {{ namespace.metadata.name }}
                </h5>
                <p class="text-gray-700">
                  <strong>Created at: </strong
                  >{{ formatDate(namespace.metadata.creationTimestamp) }}
                </p>
                <p class="text-gray-700">
                  <strong>Pods: </strong>{{ namespace.quant_pods }}
                </p>
                <p class="text-gray-700">
                  <strong>Deployments: </strong
                  >{{ namespace.quant_deployments }}
                </p>
                <p class="text-gray-700">
                  <strong>Services: </strong>{{ namespace.quant_services }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ namespace.status.phase }}
                </div>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col">
                    <button type="button" class="btn btn-warning">Edit</button
                    >&nbsp;&nbsp;
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deleteNamespace(namespace)"
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
    <br />
    <!-- Modal -->
    <div
      class="modal fade"
      id="createNamespaceModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createNamespaceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createImageModalLabel">create Namespace</h5>
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
                placeholder="Namespace name"
                aria-label="Namespace name"
                aria-describedby="basic-createon1"
                required
                v-model="namespaceName"
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
              @click="createNamespace()"
              class="btn btn-primary"
            >
              create
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import namespaces from "../assets/images/namespaces.png";
export default {
  data() {
    return {
      namespacesPNG: namespaces,
      namespaces: [],
      namespaceName: "",
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
    };
  },
  methods: {
    getInfoNamespaces() {
      axios
        .get("http://localhost:3000/api/namespaces")
        .then((resp) => {
          //console.log(resp.data)
          this.namespaces = resp.data;
          this.message = "";
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
      this.namespaceName = null;
      $("#createNamespaceModal").modal("toggle");
    },
    createNamespace() {
      this.errorMessageModal = "";
      this.messageModal = "Creating namespace...";
      axios
        .post("http://localhost:3000/api/namespaces", {
          name: this.namespaceName,
        })
        .then((resp) => {
          this.message = "Namespace created successfully!";
          this.namespaces.push(resp.data);
          this.toggleModal();
        })
        .catch((err) => {
          this.messageModal = "";
          this.errorMessageModal = err.response.data.message;
        });
    },
    deleteNamespace(namespace) {
      axios
        .delete(
          "http://localhost:3000/api/namespaces/" + namespace.metadata.name
        )
        .then((resp) => {
          console.log(resp.data);
          this.message = "Deleting Namespace, please wait 8 seconds";
          setTimeout(() => {
            this.getInfoNamespaces();
            setTimeout(() => {
              this.message = "Namespace deleted Sucessfully";
            }, 1000);
          }, 8000);
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
  },
  mounted() {
    this.getInfoNamespaces();
  },
};
</script>
