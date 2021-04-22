<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Virtual Machines</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button @click.prevent="changeNavBarItem('virtualmachines')">
              <div
                class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
              >
                <div class="p-3">
                  <img v-bind:src="computerPNG" width="50" />
                </div>

                <div class="mx-5">
                  <h4 class="text-2xl font-semibold text-gray-700">12</h4>
                  <div class="text-gray-600">Virtual Machines</div>
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
import computer from "../assets/images/computer.png";
export default {
  data() {
    return {
      computerPNG: computer,
    };
  },
  methods: {
    changeNavBarItem(option) {
      this.$store.commit("setNavBarItem", option);
    },
  },
};
</script>
