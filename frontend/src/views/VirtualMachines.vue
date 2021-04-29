<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Virtual Machines</h3>
      <br />

      <div class="mt-4">
        <div
          v-if="errorMessage"
          class="alert alert-danger text-center"
          role="alert"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="message"
          class="alert alert-primary text-center"
          role="alert"
        >
          {{ message }}
        </div>
        <div class="row">
          <div class="col-md-3" v-for="machine in machines" :key="machine.id">
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="serverPNG" />
                <h5 class="card-title text-center font-weight-bold">
                  {{ machine.name }}
                </h5>
                <p
                  class="mt-2 text-gray-700"
                  v-show="machine.image.name ? true : getImage(machine)"
                >
                  <strong>Image: </strong>{{ machine.image.name }}
                </p>
                <p
                  class="text-gray-700"
                  v-show="
                    machine.flavor.name
                      ? machine.flavor.name
                      : getFlavor(machine)
                  "
                >
                  <strong>Flavor: </strong>{{ machine.flavor.name }}
                </p>
                <p class="text-gray-700">
                  <strong>Created at: </strong>{{ formatDate(machine.created) }}
                </p>
                <p class="text-gray-700">
                  <strong>Updated at: </strong>{{ formatDate(machine.updated) }}
                </p>
                <p class="text-gray-700 font-weight-bold">IPs</p>
                <p
                  v-for="ip in machine.addresses.private"
                  :key="ip"
                  :class="
                    ip['OS-EXT-IPS:type'] != 'floating'
                      ? 'text-gray-700'
                      : 'text-red-700 font-weight-bold'
                  "
                >
                  {{ ip.addr }};
                </p>
                <p class="text-gray-700">
                  <strong>Power state: </strong
                  >{{ powerStates[machine["OS-EXT-STS:power_state"]] }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ machine.status }}
                </div>
                <br />
                <button
                  type="submit"
                  class="btn btn-danger"
                  @click="deleteMachine(machine)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="modalCreate"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          ref="modalCreate"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div
                v-if="errorMessageModal"
                class="alert alert-danger text-center"
                role="alert"
              >
                {{ errorMessageModal }}
              </div>
              <div
                v-else-if="messageModal"
                class="alert alert-primary text-center"
                role="alert"
              >
                {{ messageModal }}
              </div>
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
                          v-bind:placeholder="machineCreating.project"
                          v-bind:value="this.machineCreating.project"
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
                          v-model="this.machineCreating.name"
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
                      v-model="this.machineCreating.description"
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
                          v-bind:placeholder="machineCreating.image_file"
                          disabled
                          v-model="this.machineCreating.image_file.name"
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
                          v-model="this.machineCreating.flavor"
                        >
                          <option
                            v-for="flavor in flavors"
                            v-bind:key="flavor.name"
                            v-bind:value="flavor.id"
                          >
                            {{ flavor.name }}
                          </option>
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
                          v-model="this.machineCreating.storage"
                        >
                          <option
                            v-for="volume in volumes"
                            v-bind:key="volume.name"
                            v-bind:value="volume.id"
                          >
                            {{ volume.name == "" ? volume.id : volume.name }}
                          </option>
                        </select>
                        <small id="emailHelp" class="form-text text-muted"
                          >Storage associated to this machine</small
                        >
                      </div>

                      <div class="col">
                        <label for="exampleInputPassword1"
                          >Select Key Pair</label
                        ><br />
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          v-model="this.machineCreating.key_pair"
                        >
                          <option
                            v-for="keyPair in keyPairs"
                            v-bind:key="keyPair.name"
                            v-bind:value="keyPair.id"
                          >
                            {{ keyPair.name == "" ? keyPair.id : keyPair.name }}
                          </option>
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
                        <label for="exampleInputPassword1"
                          >Select Network</label
                        >

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
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
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
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
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
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
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
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
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
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
                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="deployMachine()"
                >
                  Deploy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </main>
</template>
<script>
import server from "../assets/images/server.png";
export default {
  data() {
    return {
      serverPNG: server,
      machines: [],
      errorMessage: "",
      message: "Loading...",
      powerStates: {
        0: "NOSTATE",
        1: "RUNNING",
        3: "PAUSED",
        4: "SHUTDOWN",
        6: "CRASHED",
        7: "SUSPENDED",
      },
    };
  },
  methods: {
    deleteMachine(machine) {
      console.log(machine);
      axios
        .delete("http://localhost:3000/api/instances/" + machine.id, {
          headers: {
            "x-token": this.$store.state.authToken,
            "x-server-address": this.$store.state.url,
          },
        })
        .then((response) => {
          //console.log("RESPONSE" + response);
          let deletedMachine = machine;
          let index = this.machines.indexOf(deletedMachine);
          //console.log(index + this.machines);
          if (index > -1) {
            this.machines.splice(index, 1);
            if (this.machines.length == 0) {
              this.message = "There are no Virtual Machines created.";
            }
          }
          //console.log(index + this.machines);
        })
        .catch((error) => {
          this.error = error.response.data.message;
          console.log(error);
        });
    },
    getFlavor(machine) {
      axios
        .get("http://localhost:3000/api/flavor/" + machine.flavor.id, {
          headers: {
            "x-token": this.$store.state.authToken,
            "x-server-address": this.$store.state.url,
          },
        })
        .then((response) => (machine.flavor.name = response.data.flavor.name))
        .catch(
          (error) => (machine.flavor.name = "Error while getting flavor name")
        );
    },
    getInfoMachines() {
      axios
        .get("http://localhost:3000/api/instances/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.machines = response.data.servers.reverse();
          this.message =
            this.machines.length == 0
              ? "There are no Virtual Machines created."
              : "";
        })
        .catch((error) => {
          this.error = error.response.data.message;
          console.log(error);
        });
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    getImage(machine) {
      if (!machine.image.id) {
        machine.image = { name: "Not defined." };
        return;
      }
      axios
        .get("http://localhost:3000/api/images/" + machine.image.id, {
          headers: {
            "x-token": this.$store.state.authToken,
            "x-server-address": this.$store.state.url,
          },
        })
        .then((response) => (machine.image.name = response.data.name))
        .catch(
          (error) => (machine.image.name = "Error while getting flavor name")
        );
    },
  },
  mounted() {
    this.getInfoMachines();
  },
};
</script>
