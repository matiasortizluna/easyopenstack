<template>
  <main>
    <template v-if="token">
        <div>
          <div x-data="{ sidebarOpen: false }" class="flex h-screen bg-gray-200">
            <div
              :class="sidebarOpen ? 'block' : 'hidden'"
              @click="sidebarOpen = false"
              class="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
            ></div>

            <div
              :class="
                sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
              "
              class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
            >
              <div class="flex items-center justify-center mt-8">
                <div class="flex items-center">
                  <img v-bind:src="logoUrl" width="200" />
                </div>
              </div>
              <navbar/>
              
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
              <header
                class="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600"
              >
                <div class="flex items-center">
                  <button
                    @click="sidebarOpen = true"
                    class="text-gray-500 focus:outline-none lg:hidden"
                  >
                    <svg
                      class="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20M4 12H20M4 18H11"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div class="flex items-center">
                  <div class="relative">
                    <button
                      @click.prevent="menuUser"
                      class="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none"
                    >
                      <img
                        class="h-full w-full object-cover"
                        v-bind:src="person"
                        alt="Your avatar"
                      />
                    </button>

                    <div
                      @click.prevent="menuUser"
                      class="fixed inset-0 h-full w-full z-10"
                      style="display: none"
                    ></div>

                    <div
                      v-show="dropdownOpen"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"
                      style="display: none"
                    >
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                        >Profile</a
                      >
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                        >Products</a
                      >
                      <button @click.prevent="logout">
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                          >Logout</a
                        >
                      </button>
                    </div>
                  </div>
                </div>
              </header>
              <router-view />
            </div>
          </div>
        </div>
    </template>
    <welcome v-else></welcome>
  </main>
</template>
<script>
import NavbarComponent from "./components/Navbar.vue";
import WelcomeView from "./views/Welcome.vue";
import imgUrl from "./assets/images/logo_complete_white.png";
import personPNG from "./assets/images/person.png";

export default {
  components: {
    navbar: NavbarComponent,
    welcome: WelcomeView,
  },
  data() {
    return {
      dropdownOpen: false,
      logoUrl: imgUrl,
      person: personPNG,
    }
  },
  methods: {
    menuUser() {
      this.dropdownOpen = !this.dropdownOpen;
      console.log(this.dropdownOpen);
    },
    logout() {
      this.$store.commit("logout");
      console.log("Log out");
    },
  },
  computed: {
    token() {
      return this.$store.state.authToken
    },
  },
};
</script>
