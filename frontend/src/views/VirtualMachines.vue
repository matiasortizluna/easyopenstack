<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Virtual Machines</h3>
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
          <div class="col-md-3" v-for="machine in machines" :key="machine.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="serverPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ machine.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  Image: {{ machine.image ? machine.image : "Not defined." }}
                </p>
                <p
                  class="text-gray-700"
                  v-show="
                    machine.flavor.name
                      ? machine.flavor.name
                      : getFlavor(machine)
                  "
                >
                  Flavor: {{ machine.flavor.name }}
                </p>
                <p class="text-gray-700">
                  Created at: {{ formatDate(machine.created) }}
                </p>
                <p class="text-gray-700">
                  Updated at: {{ formatDate(machine.updated) }}
                </p>
                <p></p>
                <p
                  v-for="ip in machine.addresses.private"
                  :key="ip"
                  :class="
                    ip['OS-EXT-IPS:type'] != 'floating'
                      ? 'text-gray-700'
                      : 'text-red-700 font-weight-bold'
                  "
                >
                  {{ ip.addr }}
                </p>
                <div class="text-black-800">Status: {{ machine.status }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </main>
</template>
<script>
import server from "../assets/images/server.png";
export default {
  data() {
    return {
      serverPNG: server,
      machines: [],
      errorMessage: "",
      message: "Loading...",
    };
  },
  methods: {
    getFlavor(machine) {
      axios
        .get("http://localhost:3000/api/flavor/" + machine.flavor.id, {
          headers: {
            "x-token": this.$store.state.authToken,
            "x-server-address": this.$store.state.url,
          },
        })
        .then((response) => (machine.flavor.name = response.data.flavor.name))
        .catch(
          (error) => (machine.flavor.name = "Error while getting flavor name")
        );
    },
    getInfoMachines() {
      axios
        .get("http://localhost:3000/api/instances/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.machines = response.data.servers.reverse();
          this.message =
            this.machines.length == 0
              ? "There are no Virtual Machines created."
              : "";
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
    this.getInfoMachines();
  },
};
</script>
