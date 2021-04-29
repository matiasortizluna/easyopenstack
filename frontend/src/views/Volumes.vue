<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Volumes <button class="btn btn-info" @click="toggleModal()">Add <i class="far fa-plus-square"></i></button></h3>

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
          <div class="col-md-3 mb-3" v-for="volume in volumes" :key="volume.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="diskPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ volume.name ? volume.name : volume.id }}
                </h5>
                <p class="mt-2 text-gray-700"><strong>Size: </strong>{{ volume.size }} Gb</p>
                <p class="text-gray-700"><strong>Bootable: </strong>{{ volume.bootable }}</p>
                <p class="text-gray-700" v-if="volume.volume_image_metadata"><strong>Bootable with image: </strong>{{ volume.volume_image_metadata.image_name }}</p>
                <p class="text-gray-700">
                  <strong>Created at: </strong>{{ formatDate(volume.created_at) }}
                </p>
                <p class="text-gray-700">
                  <strong>Updated at: </strong>{{ formatDate(volume.updated_at) }}
                </p>
                <div class="text-gray-700" v-if="volume.attachments.length">
                    <strong>Attached to:</strong>
                    <p v-for="attachment in volume.attachments" :key="attachment.id">{{ attachment.device }};</p>
                  </div>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ volume.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="addVolumeModal" tabindex="-1" role="dialog" aria-labelledby="addVolumeModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addImageModalLabel">Add Volume</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessageModal" class="alert alert-danger text-center" role="alert">
              {{errorMessageModal}}
            </div>
            <div v-else-if="messageModal" class="alert alert-primary text-center" role="alert">
              {{messageModal}}
            </div>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Volume name" aria-label="Volume name" aria-describedby="basic-addon1" required v-model="volumeName">
            </div>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Volume description" aria-label="Volume description" aria-describedby="basic-addon1" required v-model="volumeDescription">
            </div>
            <label for="volume-source">Volume source</label>
            <br>
            <select name="volume-source" v-model="volumeSource">
              <option :value="null">No source, empty</option>
              <option v-for="image in images" :key="image.id" :value="image.id">Image: {{ image.name }}</option>
            </select>
            <div class="input-group mb-3 mt-3">
              <input type="number" class="form-control" placeholder="Size (GB)" aria-label="Size" aria-describedby="basic-addon1" required v-model="volumeSize">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" @click="addVolume()" class="btn btn-primary" >Add</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import disk from "../assets/images/database.png";
export default {
  data() {
    return {
      diskPNG: disk,
      volumes: [],
      images: [],
      volumeName: null,
      volumeDescription: null,
      volumeSource: null,
      volumeSize: null,
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: ""
    };
  },

  methods: {
    getInfoVolumes() {
      axios
        .get("http://localhost:3000/api/volumes/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject,
          },
        })
        .then((response) => {
          this.volumes = response.data.volumes.reverse();
          this.message =
            this.volumes.length == 0 ? "There are no Volumes created." : "";
        })
        .catch((error) => {
          this.error = error.response.data.message;
          console.log(error);
        });
    },
    addVolume(){
      this.errorMessageModal = ""
      this.messageModal =""  
      if (this.volumeName && this.volumeDescription && this.volumeSize){
        this.errorMessageModal = ""
        this.messageModal ="Creating volume..."
        axios
        .post("http://localhost:3000/api/volumes", {
          "volumeSize": parseInt(this.volumeSize),
          "volumeName": this.volumeName,
          "volumeSource": this.volumeSource,
          "volumeDescription": this.volumeDescription
        }, {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject,
          },
        })
        .then((response) => {
          this.message = "Volume created!"
          this.getInfoVolumes()
          this.toggleModal()
        })
        .catch((error) => {
          this.messageModal =""
          this.errorMessageModal = error.response.data.message;
          console.log(error)
        })
        
        return
      }
      this.errorMessageModal = "All fields are required!"
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    toggleModal(){
      this.messageModal = ""
      this.errorMessageModal = ""
      this.volumeName = this.volumeDescription = this.volumeSource = this.volumeSize = null
      $("#addVolumeModal").modal("toggle")
    }
  },
  mounted() {
    this.getInfoVolumes();
    axios
        .get("http://localhost:3000/api/images", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.images = response.data.images
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          console.log(error)
        })
  },
};
</script>
