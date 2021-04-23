<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Virtual Machines</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoMachine('1')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="serverPNG" width="60" />

                <div class="mx-6">
                  <!-- <h4 class="text-xl font-semibold text-gray-700">
                    {{ machines[0].name }}
                  </h4> -->
                  <h4 class="text-xl font-semibold text-gray-700">NOME</h4>
                  <p class="py-2 text-gray-700">Windows 10</p>
                  <!-- <div class="text-gray-500">{{ machines[0].status }}</div> -->
                  <div class="text-gray-500">ACTIVE</div>
                  <div class="text-gray-500">#####</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoMachine('2')" v-bind:value="'hello'">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="serverPNG" width="60" />
                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700"></h4>
                  <p class="py-2 text-gray-700">Cirros 4.04</p>
                  <div class="text-gray-500"></div>
                  <div class="text-gray-500">#####</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoMachine('3')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="serverPNG" width="50" />

                <div class="mx-6">
                  <h4 class="text-xl font-bold text-gray-1000"></h4>
                  <p class="py-2 text-gray-700">UbuntuServer18.04</p>
                  <div class="text-gray-500"></div>
                  <div class="text-gray-500">#####</div>
                </div>
              </div>
            </button>
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
      machines: this.$store.state.virtualMachines,
      //machines: [],
    };
  },
  methods: {
    changeNavBarItem(option) {
      this.$store.commit("setNavBarItem", option);
    },
    getInfoMachine(option) {
      console.log(this.machines);
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
          console.log(response);
          this.machines = response.data.servers;
          //this.$store.commit("setVirtualMachines", response.data.servers);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
  },
  mounted() {
    console.log(this.machines);
    let response = this.getInfoMachines();
    console.log(this.machines);
    //setTimeout(() => {console.log(this.machines);}, 2000);
  },
  created() {
    //this.this.getInfoMachines();
    //console.log(this.machines);
    //this.machines = this.$store.state.virtualMachines;
  },
};
</script>
