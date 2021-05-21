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
          <div class="col-md-3 mb-3" v-for="pod in pods" :key="pod.metadata.uid">
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <!-- <div
      class="modal fade"
      id="addImageModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addImageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addImageModalLabel">Add image</h5>
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
                placeholder="Image name"
                aria-label="Image name"
                aria-describedby="basic-addon1"
                required
                v-model="imageName"
              />
            </div>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="URI to download the image"
                aria-label="Image URI"
                aria-describedby="basic-addon1"
                required
                v-model="imageURI"
              />
            </div>
            <select name="disk-format" v-model="diskFormat">
              <option value="ami">ami</option>
              <option value="ari">ari</option>
              <option value="vhd">vhd</option>
              <option value="vhdx">vhdx</option>
              <option value="vmdk">vmdk</option>
              <option value="raw">raw</option>
              <option value="qcow2">qcow2</option>
              <option value="vdi">vdi</option>
              <option value="iso">iso</option>
              <option value="ploop">ploop</option>
            </select>
            <div class="input-group mb-3">
              <input
                type="number"
                class="form-control"
                placeholder="Min. RAM (MB)"
                aria-label="Min. Disk"
                required
                v-model="minRam"
              />
              <span class="input-group-text">|</span>
              <input
                type="number"
                class="form-control"
                placeholder="Min. Disk (GB)"
                aria-label="Min. Disk"
                required
                v-model="minDisk"
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
            <button type="button" @click="addImage()" class="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
    </div> -->
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
    };
  },
  methods: {
    getInfoPods(){
      axios.get("http://localhost:3000/api/pods")
      .then((resp) => {
        //console.log(resp.data)
        this.message = ""
        this.pods = resp.data
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
      this.imageName = this.imageURI = this.minRam = this.minDisk = null;
      $("#addImageModal").modal("toggle");
    },
  },
  mounted() {
    this.getInfoPods()
  },
};
</script>
