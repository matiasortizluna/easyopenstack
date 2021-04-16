<template>
  <main>
    <template v-if="token">
      <!-- <navbar></navbar> -->
      <router-view />
    </template>
    <welcome v-else></welcome>
  </main>
</template>
<script>
import NavbarComponent from "./components/Navbar.vue";
import WelcomeView from "./views/Welcome.vue";
import HomeComponent from "./views/Home.vue";

export default {
  components: {
    navbar: NavbarComponent,
    welcome: WelcomeView,
    home: HomeComponent,
  },
  computed: {
    token() {
      return this.$store.state.authToken;
    },
  },
};
</script>
