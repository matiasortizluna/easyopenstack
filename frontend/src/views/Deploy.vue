<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Deploy</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button
              @click.prevent="createMachine('windows')"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
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

          <div
            class="w-full px-6 w-1/3 h-12"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
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
            <button
              @click.prevent="createMachine('ubuntu')"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
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

      <!-- Button trigger modal -->

      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                A new machine will be born :)
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="exampleInputEmail1">Project</label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    v-bind:placeholder="selectedProjectName"
                    v-bind:value="selectedProjectName"
                    disabled
                  />
                  <small id="emailHelp" class="form-text text-muted"
                    >Project associated to this machine</small
                  >
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleInputName"
                    aria-describedby="nameHelp"
                    placeholder="Name of your new machine"
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1" class="form-label"
                    >Description</label
                  >
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Write ..."
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="exampleInputImage">Image</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleInputImage"
                    aria-describedby="imageHelp"
                    placeholder="windows10.04"
                    disabled
                  />
                  <small id="emailHelp" class="form-text text-muted"
                    >Project associated to this email</small
                  >
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Select Storage</label
                  ><br />
                  <select
                    class="form-select"
                    aria-label="Default select example"
                  >
                    <option value="new" selected>New</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                  />
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="exampleCheck1"
                  />
                  <label class="form-check-label" for="exampleCheck1"
                    >Check me out</label
                  >
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
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
      creatingMachine: "",
      selectedProjectName: this.$store.state.selectedProjectName,
    };
  },
  methods: {
    createMachine(option) {
      console.log(option);
      console.log(this.selectedProjectName);
    },
  },
};
</script>
