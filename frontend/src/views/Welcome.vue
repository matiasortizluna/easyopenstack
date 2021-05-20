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
            Managing a K8s cluster made easy
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
            <strong class="font-bold">{{ connectingMessage }} </strong>
            <span class="block sm:inline"> Wait please :)</span>
          </div>
          <div
            v-show="error"
            class="mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold">Failed! -> </strong>
            <span class="block sm:inline">{{ error }}</span>
          </div>
          <template v-if="error">
            <p class="text-gray-100">Select your KUBECONFIG file</p>
            <form action="" class="sm:w-2/3 w-full px-4 lg:px-1 mx-auto">
              <div class="pb-1 pt-4">
                <input
                  type="file"
                  name="kubeconfig-file"
                  id="kubeconfig-file"
                  placeholder="Kubeconfig"
                  class="block w-full p-4 text-lg rounded-sm bg-black"
                  @change="selectFile($event)"
                  required
                />
              </div>
              <div class="px-4 pb-2 pt-4">
                <button
                  class="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
                  @click.prevent="upload"
                >
                  Upload file
                </button>
              </div>
            </form>
          </template>
          <br />
        </div>
      </div>
    </section>
  </main>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      username: "",
      password: "",
      connecting: true,
      connectingMessage: "Checking KUBECONFIG file...",
      error: "",
      selectedFile: null
    };
  },
  methods: {
    upload() {
      this.error = ""
      this.connecting = true
      let formData = new FormData()
      formData.append('kubeconfig', this.selectedFile)
      axios.post("http://localhost:3000/api/uploadkubeconfig", formData)
      .then(() => this.checkKubeconfig())
      .catch((err) => {
        this.connecting = false
        this.error = err.response.data.message
      })
    },
    selectFile(event){
      this.selectedFile = event.target.files[0]
    },
    checkKubeconfig(){
      this.error = ""
      this.connecting = true
      axios.get("http://localhost:3000/api/checkkubeconfig")
      .then(() => {
       this.connectingMessage = "Trying to connect to server..."
       axios.get("http://localhost:3000/api/nodes")
       .then(() => this.$emit('kubeconfig-valid'))
       .catch((err) => {
         this.connecting = false
         this.error = "Can't connect to server. Check the IP in your KUBECONFIG file and upload it again or check connection to server (e.g send a ping) and then reload this page. ERRNO: "+err.response.data.err_code
       })
      })
      .catch((err) => {
        this.connecting = false
        this.error = err.response.data.message
      })
    }
  },
  mounted(){
    this.checkKubeconfig()
  }
};
</script>
