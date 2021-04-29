<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Heat</h3>
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
          this.message="A keypair has been generated for this plugin. Use the private key downloaded to connect to machines created by Heat. - "
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
    }
  },
  mounted(){
    this.getStacks()
  }
};
</script>
