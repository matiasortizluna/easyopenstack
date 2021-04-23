<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Volumes</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoVolume('1')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="diskPNG" width="60" />

                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700">NOME</h4>
                  <p class="py-2 text-gray-700">Volume HDD</p>
                  <div class="text-gray-500">25 GB</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoVolume('2')" v-bind:value="'hello'">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="diskPNG" width="60" />
                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700">NOME</h4>
                  <p class="py-2 text-gray-700">Volume SSD</p>
                  <div class="text-gray-500">25 GB</div>
                </div>
              </div>
            </button>
          </div>

          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="getInfoVolume('3')">
              <div
                class="flex items-center px-5 py-5 shadow-sm rounded-md bg-white"
              >
                <img v-bind:src="diskPNG" width="50" />

                <div class="mx-6">
                  <h4 class="text-xl font-semibold text-gray-700">NOME</h4>
                  <p class="py-2 text-gray-700">Volume HDD</p>
                  <div class="text-gray-500">25 GB</div>
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
import disk from "../assets/images/database.png";
export default {
  data() {
    return {
      diskPNG: disk,
    };
  },

  methods: {
    changeNavBarItem(option) {
      this.$store.commit("setNavBarItem", option);
    },
  },
};
</script>
