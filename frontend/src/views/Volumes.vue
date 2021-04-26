<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Volumes</h3>

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
          <div class="col-md-3" v-for="volume in volumes" :key="volume.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="diskPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ volume.name ? volume.name : volume.id }}
                </h5>
                <p class="mt-2 text-gray-700">Size: {{ volume.size }} Gb</p>
                <p class="text-gray-700">
                  Created at: {{ formatDate(volume.created_at) }}
                </p>
                <p class="text-gray-700">
                  Updated at: {{ formatDate(volume.updated_at) }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ volume.status }}
                </div>
              </div>
            </div>
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
      errorMessage: "",
      message: "Loading...",
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
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
  },
  mounted() {
    this.getInfoVolumes();
  },
};
</script>
