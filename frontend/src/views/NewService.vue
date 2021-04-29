<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Heat <button class="btn btn-info" @click="toggleModal()">Create stack <i class="far fa-plus-square"></i></button></h3>
      <br />
      <p class="text-black-400">Note: If you don't have a Keypair created, use the "heat_keypair" that was created here. (Change your stack config resources to use this keypair).</p>
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
          
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="createStackModal" tabindex="-1" role="dialog" aria-labelledby="CreateStackModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addImageModalLabel">Create stack</h5>
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
            <button type="button" @click="createStack()" class="btn btn-primary" >Create</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { saveAs } from 'file-saver'
export default {
  data() {
    return {
      stacks: null,
      message: "Loading...",
      errorMessage: "",
      errorMessageModal: "",
      messageModal: ""
    };
  },

  methods: {
    getStacks(){
      axios.get("http://localhost:3000/api/heat/stacks", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject
          },
        })
      .then((response) => {
        this.message=""
        if(response.data.private_key){
          this.message="A keypair has been generated. Use it if you don't have any keypair created. - "
          let blob = new Blob([response.data.private_key], {type: "text/plain;charset=utf-8"})
          saveAs(blob, "private_key.pem");
        }
        if(!response.data.stacks.length){
          this.message += "There is no stacks created"
          return
        }
        this.stacks = response.data.stacks
        this.message = ""
        })
      .catch((err) => {
        this.message=""
        this.errorMessage = err.response.data.message
      })
    },
    toggleModal(){
      this.messageModal = ""
      this.errorMessageModal = ""
      //this.volumeName = this.volumeDescription = this.volumeSource = this.volumeSize = null
      $("#createStackModal").modal("toggle")
    },
    createStack(){

    }
  },
  mounted(){
    this.getStacks()
  }
};
</script>
