<template>
  <main>
    <section class="min-h-screen flex items-stretch text-white">
      <div
        class="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
      >
        <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div class="w-full px-24 z-10">
          <h1 class="text-5xl font-bold text-left tracking-wide">
            Keep it simple
          </h1>
          <p class="text-3xl my-4">
            Deploy your machines easily, we'll take of the process, you focus on
            working 😉
          </p>
        </div>
        <div
          class="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4"
        >
          <span>
            <div
              class="w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900"
            >
              <img
                src="/src/assets/images/fabio.jpeg"
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
          </span>
          <span>
            <div
              class="w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900"
            >
              <img
                src="/src/assets/images/matias.png"
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
          </span>
        </div>
      </div>
      <div
        class="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style="background-color: #161616"
      >
        <div
          class="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
        >
          <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>
        <div class="w-full pxy-6 z-20 px-3">
          <h1 class="my-6">
            <img
              src="/src/assets/images/logo_white.png"
              alt=""
              class="w-auto h-12 sm:h-12 inline-flex"
            />
          </h1>
          <div
            v-show="connecting"
            class="mb-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold">Trying to connect ... </strong>
            <span class="block sm:inline">Wait please :)</span>
          </div>
          <div
            v-show="error"
            class="mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold">Failed! -> </strong>
            <span class="block sm:inline">{{ error }}</span>
          </div>
          <p class="text-gray-100">Select your OpenStack Server</p>
          <form action="" class="sm:w-2/3 w-full px-4 lg:px-1 mx-auto">
            <div class="pb-1 pt-4">
              <input
                type="text"
                name="ip_server"
                id="ip_server"
                placeholder="IP Address"
                class="block w-full p-4 text-lg rounded-sm bg-black"
                v-model="url"
              />
            </div>
            <p class="text-gray-100 pb-1 pt-3">
              Log in with your username and password
            </p>
            <div class="pb-2 pt-1">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                class="block w-full p-4 text-lg rounded-sm bg-black"
                v-model="username"
              />
            </div>
            <div class="pb-1 pt-1">
              <input
                class="block w-full p-4 text-lg rounded-sm bg-black"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                v-model="password"
              />
            </div>

            <div class="px-4 pb-2 pt-4">
              <button
                class="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
                @click.prevent="connect"
              >
                Connect
              </button>
            </div>

            <div
              class="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden"
            >
              <a href="#">
                <img
                  src="/src/assets/images/fabio.jpeg"
                  alt=""
                  class="rounded object-cover"
                  width="50"
                  height="50"
                />
              </a>
              <a href="#">
                <img
                  src="/src/assets/images/matias.png"
                  alt=""
                  class="rounded object-cover"
                  width="57"
                />
              </a>
            </div>
          </form>
          <br />
        </div>
      </div>
    </section>
  </main>
</template>
<script>
//import axios from 'axios';
export default {
  data() {
    return {
      url: "",
      username: "",
      password: "",
      connecting: false,
      error: "",
    };
  },
  methods: {
    connect() {
      let regex = /^(https|http)(\:\/\/)([a-zA-Z0-9\.]+)(\:)([0-9]{2,5})$/;
      this.error = "";
      this.connecting = false;
      if (regex.test(this.url)) {
        this.connecting = true;
        axios
          .post("http://localhost:3000/api/token", {
            server_address: this.url,
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            this.connecting = false;
            this.$store.commit("setToken", response.data.token);
            this.$store.commit("setURL", this.url);
            this.$store.commit("setSelectedProject", response.data.projectId);
            this.$store.commit(
              "setSelectedProjectName",
              response.data.projectName
            );
          })
          .catch((error) => {
            this.connecting = false;
            this.error = error.response.data.message;
            if (error.response.status == 401)
              this.error += " (Check your credentials.)";
          });
      } else {
        this.error = "Invalid address :( Format: http/https://ip_or_name:port";
      }
    },
  },
};
</script>
