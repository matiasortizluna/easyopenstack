<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Dashboard</h3>
    </div>

    <select
      class="form-select"
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

    <div>
      <div class="mt-4">
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
                <div class="text-gray-500">Instances</div>
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
export default {
  data() {
    return {
      selectedProject: this.$store.state.selectedProject,
      projects: [],
      computerPNG: computer,
    };
  },
  methods: {
    selectProject() {},
    changeProject(event) {
      console.log(event.target.value);
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
        //this.$store.commit("setSelectedProject", response.data.projects[0]);
      })
      .catch((error) => {
        this.error = error.response.data.message;
      });
  },
};
</script>

<style>
</style>