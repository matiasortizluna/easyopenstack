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
          :selected="project.id == selectedProjectId"
          v-bind:value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <router-link to="/vm" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="computerPNG" width="50" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberInstances }}
                </h4>
                <div class="text-gray-600">Virtual Machines</div>
              </div>
            </div>
          </router-link>
          <router-link to="/volumes" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="databasePNG" width="67" />
              </div>

              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberVolumes }}
                </h4>
                <div class="text-gray-500">Volumes</div>
              </div>
            </div>
          </router-link>

          <router-link to="/images" class="w-full px-6 w-1/3 h-12">
            <div
              class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
            >
              <div class="p-3">
                <img v-bind:src="cdPNG" width="65" />
              </div>
              <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                  {{ numberImages }}
                </h4>
                <div class="text-gray-500">Images</div>
              </div>
            </div>
          </router-link>
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
      numberInstances: "...",
      numberVolumes: "...",
      numberImages: "...",
    };
  },
  methods: {
    changeProject(event) {
      let newProjectId = event.target.value;
      this.numberInstances = this.numberVolumes = this.numberImages = "...";

      axios
        .get("http://localhost:3000/api/token/changeScope", {
          headers: {
            "X-Old-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-New-Project-Id": newProjectId,
          },
        })
        .then((response) => {
          this.$store.commit("setSelectedProject", response.data.projectId);
          this.$store.commit(
            "setSelectedProjectName",
            response.data.projectName
          );

          this.$store.commit("setToken", response.data.token);
          this.getProjectInfo();
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    getProjectInfo() {
      axios
        .get("http://localhost:3000/api/instances/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.numberInstances = response.data.servers.length;
        })
        .catch((error) => {
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
        this.getProjectInfo();
      })
      .catch((error) => {
        this.error = error.response.data.message;
      });
  },
  computed: {
    selectedProjectId() {
      return this.$store.state.selectedProject;
    },
  },
};
</script>
<style>
</style>