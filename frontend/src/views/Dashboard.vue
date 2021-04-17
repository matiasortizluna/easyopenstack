<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Dashboard</h3>

      <br />

      <select
        class="form-select center"
        aria-label="Default select example"
        @change="changeProject($event)"
      >
        <option
          v-for="project in projects"
          v-bind:key="project.id"
          v-bind:selected="
            this.$store.state.selectProject == project.id ? true : false
          "
          v-bind:value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <button>
              <div
                class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
              >
                <div class="p-3 rounded-full bg-green-600 bg-opacity-75">
                  <img v-bind:src="computerPNG" />
                </div>

                <div class="mx-5">
                  <h4 class="text-2xl font-semibold text-gray-700">
                    {{ numberInstances }}
                  </h4>
                  <div class="text-gray-600">Instances</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <button>
              <div
                class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
              >
                <div class="p-3 rounded-full bg-yellow-600 bg-opacity-75">
                  <img v-bind:src="databasePNG" />
                </div>

                <div class="mx-5">
                  <h4 class="text-2xl font-semibold text-gray-700">
                    {{ numberVolumes }}
                  </h4>
                  <div class="text-gray-500">Volumes</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <button>
              <div
                class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
              >
                <div class="p-3 rounded-full bg-blue-600 bg-opacity-75">
                  <img v-bind:src="cdPNG" />
                </div>
                <div class="mx-5">
                  <h4 class="text-2xl font-semibold text-gray-700">
                    {{ numberImages }}
                  </h4>
                  <div class="text-gray-500">Images</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <br />

        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                <img v-bind:src="computerPNG" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
                <div class="text-gray-500">New Users</div>
              </div>
            </div>
          </div>

          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                <img v-bind:src="computerPNG" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
                <div class="text-gray-500">New Users</div>
              </div>
            </div>
          </div>

          <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                <img v-bind:src="computerPNG" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
                <div class="text-gray-500">New Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import computer from "../assets/images/computer.png";
import database from "../assets/images/database.png";
import cd from "../assets/images/cd.png";
export default {
  data() {
    return {
      selectedProject: this.$store.state.selectedProject,
      projects: [],
      computerPNG: computer,
      databasePNG: database,
      cdPNG: cd,
      numberInstances: 0,
      numberVolumes: 0,
      numberImages: 0,
    };
  },
  methods: {
    changeProject(event) {
      console.log(event.target.value);
    },
    getProjectInfo() {
      axios.get("");
    },
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/projects", {
        headers: {
          "X-Token": this.$store.state.authToken,
          "X-Server-Address": this.$store.state.url,
        },
      })
      .then((response) => {
        this.projects = response.data.projects;
        this.$store.commit("setSelectedProject", response.data.projects[0]);

        axios
          .get("http://localhost:3000/api/instances", {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.$store.state.url,
            },
          })
          .then((response) => {
            //console.log(response.data.servers.length);
            this.numberInstances = response.data.servers.length;
          })
          .catch((error) => {
            console.log(error);
            this.error = error.response.data.message;
          });

        axios
          .get("http://localhost:3000/api/volumes", {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.$store.state.url,
              "x-project-id": this.$store.state.selectedProject,
            },
          })
          .then((response) => {
            this.numberVolumes = response.data.volumes.length;
          });
      })
      .catch((error) => {
        this.error = error.response.data.message;
      });

    axios
      .get("http://localhost:3000/api/images", {
        headers: {
          "X-Token": this.$store.state.authToken,
          "X-Server-Address": this.$store.state.url,
        },
      })
      .then((response) => {
        this.numberImages = response.data.images.length;
      })
      .catch((error) => {
        this.error = error.response.data.message;
      });
  },
};
</script>

<style>
</style>