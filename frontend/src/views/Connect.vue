<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Connect</h3>

      <br />

      <button class="btn btn-info" @click="toggleModal()">
        Add <i class="far fa-plus-square"></i>
      </button>

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
          <div
            class="col-md-3 mb-3"
            v-for="floating in this.floatings"
            v-bind:key="floating.id"
          >
            <div class="card" style="width: 18rem">
              <div class="card-body">
                <img class="rounded mx-auto d-block w-20" :src="addressPNG" />
                <br />
                <h2
                  class="card-title text-center font-weight-bold text-red-500"
                >
                  {{ floating.floating_ip_address ?? "---" }}
                </h2>
                <h5 class="card-title text-center font-weight-bold">
                  {{ floating.fixed_ip_address ?? "---" }}
                </h5>
                <p class="mt-2 text-gray-700">
                  <strong>Description: </strong> {{ floating.description }}
                </p>
                <p class="text-gray-700">
                  <strong>Created at: </strong>
                  {{ formatDate(floating.created_at) }}
                </p>
                <p class="text-gray-700">
                  <strong>Updated at: </strong>
                  {{ formatDate(floating.updated_at) }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ floating.status }}
                </div>

                <button
                  v-if="floating.status != 'ACTIVE'"
                  type="submit"
                  class="btn btn-success"
                  @click="toggleModalConnect(floating)"
                >
                  Connect
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
                  Create new IP Floting Points
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

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Create</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="modalConnect"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          ref="modalConnect"
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
                <h5 class="modal-title" id="exampleModalLongTitle">Connect</h5>
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
                        <label for="exampleInputPassword1">Select Port</label
                        ><br />
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          v-model="this.request.port"
                        >
                          <option
                            v-for="port in ports"
                            v-bind:key="port.id"
                            v-bind:value="port"
                          >
                            {{
                              port.machine
                                ? port.machine.name
                                : port.mac_address
                            }}
                            ({{ port.fixed_ips[0].ip_address }})
                          </option>
                        </select>
                        <small id="emailHelp" class="form-text text-muted"
                          >Port to associate to this Floating IP</small
                        >
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
                  @click="connect()"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import ip from "../assets/images/address.png";
export default {
  data() {
    return {
      addressPNG: ip,
      message: "",
      errorMessage: "",
      errorMessageModal: "",
      messageModal: "",
      address: "",
      floatings: [],
      ports: [],
      machines: [],
      request: {
        port: {},
        floating: {},
      },
    };
  },
  methods: {
    toggleModal() {
      this.messageModal = "";
      this.errorMessageModal = "";
      $("#modalCreate").modal("toggle");
    },
    toggleModalConnect(floating) {
      this.request.floating = floating;
      this.messageModal = "";
      this.errorMessageModal = "";
      $("#modalConnect").modal("toggle");
    },
    getFloatings() {
      axios
        .get("http://localhost:3000/api/floating", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
          },
        })
        .then((response) => {
          this.floatings = response.data.floatingips;
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage =
            "Error in Getting information about Floating Points";
        });
    },
    getPorts() {
      axios
        .get("http://localhost:3000/api/ports", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
          },
        })
        .then((response) => {
          //console.log(response);
          this.ports = response.data.ports;
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage =
            "Error in Getting information about Floating Points";
        });
    },
    getMachines() {
      axios
        .get("http://localhost:3000/api/instances/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.machines = response.data.servers;
          //console.log(this.machines);
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Machines";
        });
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    connect() {
      console.log("Connect ....");
      console.log(this.request);
      axios
        .put(
          "http://localhost:3000/api/floating/port",
          {
            floatingip: this.request.floating,
            floatingip_id: this.request.floating.id,
            port_id: this.request.port.id,
          },
          {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.address,
            },
          }
        )
        .then((response) => {
          console.log(response);
          //this.machines = response.data.servers;
          //console.log(this.machines);
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Machines";
        });
    },
    getAllInfo() {
      //console.log(this.ports);
      this.ports.forEach((port) => {
        this.machines.forEach((machine) => {
          //  console.log(machine);
          if (
            machine.addresses &&
            machine.addresses.private &&
            machine.addresses.private[1]["OS-EXT-IPS-MAC:mac_addr"] ==
              port.mac_address
          ) {
            port.machine = machine;
          }
        });
      });
    },
  },
  mounted() {
    var ip_address = this.$store.state.url.split(":");
    this.address = ip_address[0] + ":" + ip_address[1];
    this.getFloatings();
    this.getPorts();
    this.getMachines();
    setTimeout(() => {
      this.getAllInfo();
    }, 1000);
  },
};
</script>
