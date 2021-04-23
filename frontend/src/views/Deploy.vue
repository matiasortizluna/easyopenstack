<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Deploy</h3>

      <br />

      <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 w-1/3 h-12">
            <button data-toggle="modal" data-target="#exampleModalCenter">
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
            <button>
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
            <button data-toggle="modal" data-target="#exampleModalCenter">
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
                  <div class="row">
                    <div class="col">
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
                    <div class="col">
                      <label for="exampleInputEmail1">Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputName"
                        aria-describedby="nameHelp"
                        placeholder="Tony Stark's Machine"
                      />
                      <small id="emailHelp" class="form-text text-muted"
                        >Name associated to this machine</small
                      >
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1" class="form-label"
                    >Description</label
                  >
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="2"
                    placeholder="Write ..."
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col">
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
                        >Image associated to this machine</small
                      >
                    </div>
                    <div class="col">
                      <label for="exampleInputPassword1">Select Flavor</label
                      ><br />
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="new" selected>m1.nano</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      <small id="emailHelp" class="form-text text-muted"
                        >Flavor associated to this machine</small
                      >
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col">
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
                      <small id="emailHelp" class="form-text text-muted"
                        >Storage associated to this machine</small
                      >
                    </div>

                    <div class="col">
                      <label for="exampleInputPassword1">Select Key Pair</label
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
                      <small id="emailHelp" class="form-text text-muted"
                        >Key Pair associated to this machine</small
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="exampleInputPassword1">Select Network</label>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          Private
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          Shared
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          CPD Network 2.0
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label for="exampleInputPassword1"
                        >Select Security Group</label
                      >

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          Default
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          CPD Network 2.0
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
              <button type="submit" class="btn btn-primary">Deploy</button>
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
      selectedProjectName: "",
    };
  },
  computed: {
    selectedProjectName() {
      return this.$store.state.selectedProjectName;
    },
  },
};
</script>
