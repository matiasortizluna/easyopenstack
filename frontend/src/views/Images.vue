<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">
        Images
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
          <div class="col-md-3 mb-3" v-for="image in images" :key="image.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="cdPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ image.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  Format: {{ image.disk_format }}
                </p>
                <p class="text-gray-700">
                  Size: {{ (image.size * 0.00000095367432).toFixed(1) }} Mb
                </p>
                <p class="text-gray-700">
                  Created at: {{ formatDate(image.created_at) }}
                </p>
                <p class="text-gray-700">
                  Updated at: {{ formatDate(image.updated_at) }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ image.status }}
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
    </div>
  </main>
</template>
<script>
import cd from "../assets/images/cd.png";
export default {
  data() {
    return {
      cdPNG: cd,
      images: [],
      imageName: null,
      imageURI: null,
      minRam: null,
      minDisk: null,
      diskFormat: "ami",
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
    };
  },

  methods: {
    //http://192.168.56.102/image/v2/images/c0817e7a-8458-4b91-9c5d-d6e31f0ede83/import
    getInfoImages() {
      axios
        .get("http://localhost:3000/api/images", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.images = response.data.images;
          this.message =
            this.images.length == 0 ? "There are no Images created." : "";
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          console.log(error);
        });
    },
    addImage() {
      this.errorMessageModal = "";
      this.messageModal = "";
      if (this.imageName && this.imageURI && this.minRam && this.minDisk) {
        this.errorMessageModal = "";
        this.messageModal = "Creating image...";
        axios
          .post(
            "http://localhost:3000/api/images",
            {
              imageName: this.imageName,
              imageURI: this.imageURI,
              minRam: this.minRam,
              minDisk: this.minDisk,
              diskFormat: this.diskFormat,
            },
            {
              headers: {
                "X-Token": this.$store.state.authToken,
                "X-Server-Address": this.$store.state.url,
              },
            }
          )
          .then((response) => {
            this.message = "Image created!";
            this.getInfoImages();
            this.toggleModal();
          })
          .catch((error) => {
            this.messageModal = "";
            this.errorMessageModal =
              error.response.data.message + " (Check the URI)";
            console.log(error);
          });

        return;
      }
      this.errorMessageModal = "All fields are required!";
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
    this.getInfoImages();
  },
};
</script>
