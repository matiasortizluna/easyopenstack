<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Pods
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
            v-for="pod in pods"
            :key="pod.metadata.uid"
          >
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="podsPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ pod.metadata.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  <strong>Namespace: </strong>{{ pod.metadata.namespace }}
                </p>
                <p class="mt-2 text-gray-700">
                  <strong>On node: </strong>{{ pod.spec.nodeName }}
                </p>
                <p class="text-gray-700">
                  <strong>Running app: </strong>{{ pod.metadata.labels.app }}
                </p>
                <p class="text-gray-700">
                  <strong>Containers: </strong>{{ pod.spec.containers.length }}
                </p>
                <p class="text-gray-700">
                  <strong>Host IP: </strong>{{ pod.status.hostIP }}
                </p>
                <p class="text-gray-700">
                  <strong>Pod IP: </strong>{{ pod.status.podIP }}
                </p>
                <p class="text-gray-700">
                  <strong>Created at: </strong
                  >{{ formatDate(pod.metadata.creationTimestamp) }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ pod.status.phase }}
                </div>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col">
                    <button type="button" class="btn btn-warning">Edit</button
                    >&nbsp&nbsp
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deletePod(pod)"
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
      id="addPodModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addPodModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addPodModalLabel">Add Pod</h5>
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
            <p>Select the YAML file that contains the pod configuration</p>
            <div class="input-group mb-3">
              <input
                type="file"
                class="form-control"
                placeholder="Pod config file"
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
            <button type="button" @click="addPod()" class="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import pods from "../assets/images/pods.png";
export default {
  data() {
    return {
      podsPNG: pods,
      pods: [],
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
      selectedFile: null,
    };
  },
  methods: {
    getInfoPods() {
      axios
        .get("http://localhost:3000/api/pods")
        .then((resp) => {
          //console.log(resp.data)
          this.message = "";
          this.pods = resp.data;
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
      this.PodName = null;
      $("#addPodModal").modal("toggle");
    },
    selectFile(event) {
      this.selectedFile = event.target.files[0];
    },
    addPod() {
      this.errorMessageModal = "";
      if (!this.selectedFile)
        return (this.errorMessageModal = "Please select a file!");
      this.messageModal = "Creating pod...";
      let formData = new FormData();
      formData.append("pod_configfile", this.selectedFile);
      axios
        .post("http://localhost:3000/api/pods", formData)
        .then((resp) => {
          this.pods.push(resp.data);
          this.message = "Pod created successfully!";
          this.toggleModal();
        })
        .catch((err) => {
          this.errorMessageModal = err.response.data.message;
        });
    },
    deletePod(pod) {
      console.log(pod);
      axios
        .delete(
          "http://localhost:3000/api/namespaces/" +
            pod.metadata.namespace +
            "/" +
            pod.metadata.name
        )
        .then((resp) => {
          console.log(resp.data);
          this.message = "Deleting Pod, please wait 3 seconds";
          setTimeout(() => {
            this.getInfoPods();
            setTimeout(() => {
              this.message = "Pod deleted Sucessfully";
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
  },
  mounted() {
    this.getInfoPods();
  },
};
</script>
