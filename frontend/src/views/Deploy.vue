<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Deploy</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="createMachine('windows')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="windowsPNG" width="60" />

                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700">Windows</h4>
                  <p class="py-2 text-gray-700">Windows 10</p>
                  <div class="text-gray-500">1 GB RAM</div>
                  <div class="text-gray-500">25 GB SSD</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="createMachine('cirros')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="cirrosPNG" width="60" />
                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700">Cirros</h4>
                  <p class="py-2 text-gray-700">Cirros 4.04</p>
                  <div class="text-gray-500">1 GB RAM</div>
                  <div class="text-gray-500">25 GB SSD</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="createMachine('ubuntu')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="linuxPNG" width="50" />

                <div class="mx-6">
                  <h4 class="text-xl font-bold text-gray-1000">Ubuntu</h4>
                  <p class="py-2 text-gray-700">UbuntuServer18.04</p>
                  <div class="text-gray-500">1 GB RAM</div>
                  <div class="text-gray-500">25 GB SSD</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import server from "../assets/images/server.png";
import windows from "../assets/images/windows.png";
import linux from "../assets/images/linux.png";
import cirros from "../assets/images/cirros.png";
export default {
  data() {
    return {
      serverPNG: server,
      windowsPNG: windows,
      linuxPNG: linux,
      cirrosPNG: cirros,
    };
  },
  methods: {
    changeNavBarItem(option) {
      this.$store.commit("setNavBarItem", option);
    },
    createMachine(option) {
      console.log(option);
    },
  },
};
</script>
