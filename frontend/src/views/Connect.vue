<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Connect</h3>

      <br />
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
