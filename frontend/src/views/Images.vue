<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Images</h3>

      <br />

      <div class="mt-4">
        <div v-if="errorMessage" class="alert alert-danger text-center" role="alert">
          {{errorMessage}}
        </div>
        <div v-else-if="message" class="alert alert-primary text-center" role="alert">
          {{message}}
        </div>
        <div class="row">
          <div class="col-md-3" v-for="image in images" :key="image.id">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="cdPNG" >
                <h5 class="card-title text-center font-weight-bold"> {{ image.name }}</h5>
                <p class="mt-2 text-gray-700">Format: {{ image.disk_format }}</p>
                <p class="text-gray-700">Size: {{ image.size*0.00000095367432 }}</p>
                <p class="text-gray-700">Created at: {{ formatDate(image.created_at) }}</p>
                <p class="text-gray-700">Updated at: {{ formatDate(image.updated_at) }}</p>
                <div class="text-black-800 font-weight-bold">Status: {{ image.status }}</div>
              </div>
            </div>
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
      errorMessage: "",
      message: "Loading..."
    };
  },

  methods: {
    getInfoImages() {
      axios
        .get("http://localhost:3000/api/images", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject
          },
        })
        .then((response) => {
          this.images = response.data.images
          this.message = this.images.length == 0 ? "There are no Images created." : ""
        })
        .catch((error) => {
          this.error = error.response.data.message;
          console.log(error)
        })
    },
    formatDate(date){
      let dateObject = new Date(date)
      return dateObject.toLocaleString()
    }
  },
  mounted(){
    this.getInfoImages()
  }
};
</script>
