<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <div class="row">
        <h3 class="text-gray-700 text-3xl font-medium">Connect</h3>
        <div class="col">
          <button class="btn btn-info" @click="toggleModal()">
            Add Floating IPs<i class="far fa-plus-square"></i>
          </button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-warning" @click="toggleModalRules()">
            Create Security Group Rules <i class="far fa-plus-square"></i>
          </button>
        </div>
      </div>
      <br />
      <div>
        <h2>
          In order to connect to your machine, you must follow these 3 steps:
        </h2>
        <p>
          1. Associate a Floating Point to your machine, if you don't have any,
          you can create it
        </p>
        <p>
          2. Change the Security Group Rules (if you haven't yet) so you can
          have full permissions to access to it
        </p>
        <p>
          3. Check the portforwarding settings of your OpenStack Server so you
          can connect from the outside (If needed)
        </p>
      </div>

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
                <br />
                <button
                  v-show="floating.status != 'ACTIVE'"
                  type="submit"
                  class="btn btn-success"
                  @click="toggleModalConnect(floating)"
                >
                  Associate
                </button>
                <button
                  v-show="floating.status == 'ACTIVE'"
                  type="submit"
                  class="btn btn-danger"
                  @click="desconnect(floating)"
                >
                  Dessasociate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="modalRules"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          ref="modalRules"
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
                  Change Security Group Rules
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
                <div class="form-group">
                  <div class="row">
                    <div class="col">
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
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="input-group mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Description"
                          aria-label="Image name"
                          aria-describedby="basic-addon1"
                          required
                          v-model="security_group_rule.description"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <label>Rule Type</label>
                      <br />
                      <select
                        name="ruleType"
                        v-model="security_group_rule.protocol"
                      >
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                        <option value="ICMP">ICMP</option>
                        <option value="SSH">SSH (Default)</option>
                      </select>
                    </div>
                    <div class="col">
                      <label>Rule Direction</label>
                      <br />
                      <select
                        name="ruleSide"
                        v-model="security_group_rule.direction"
                      >
                        <option value="ingress">Ingress</option>
                        <option value="egress">Egress</option>
                      </select>
                    </div>
                  </div>
                  <br />
                  <div class="row">
                    <div class="col">
                      <label>Type</label>
                      <br />
                      <select
                        name="ethernetType"
                        v-model="security_group_rule.ethertype"
                      >
                        <option value="ipv4">IPv4</option>
                        <option value="ipv6">IPv6</option>
                      </select>
                    </div>
                    <div class="col">
                      <label>Min Port Number</label>
                      <br />
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Port Number"
                        aria-label="Port Number"
                        required
                        v-model="security_group_rule.port_range_min"
                      />
                    </div>
                    <div class="col">
                      <label>Max Port Number</label>
                      <br />
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Port Number"
                        aria-label="Port Number"
                        required
                        v-model="security_group_rule.port_range_max"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="row">
                  <div class="col">
                    <button
                      type="submit"
                      class="btn btn-success"
                      @click="easyConnect"
                    >
                      Easy (SSH & ICMP)
                    </button>
                  </div>
                  <div class="col">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                  <div class="col">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      @click="createRules"
                    >
                      Create Rule
                    </button>
                  </div>
                </div>
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
                            <template>
                              {{ port.machine ? port.machine.name : "" }}
                              ({{ port.fixed_ips[0].ip_address }})
                            </template>
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
      rules: [],
      security_group_rule: {
        direction: "",
        port_range_min: "",
        ethertype: "",
        port_range_max: "",
        protocol: "",
        security_group_id: "",
        remote_ip_prefix: "0.0.0.0/0",
      },
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
    toggleModalRules() {
      //this.request.floating = floating;
      this.getRules();
      this.messageModal = "";
      this.errorMessageModal = "";
      $("#modalRules").modal("toggle");
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
          console.log(response.data.floatingip);
          this.toggleModalConnect();
          this.getFloatings();
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Machines";
        });
    },
    desconnect(floating) {
      console.log(floating);
      axios
        .put(
          "http://localhost:3000/api/floating/port",
          {
            floatingip: floating,
            floatingip_id: floating.id,
            port_id: null,
          },
          {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.address,
            },
          }
        )
        .then((response) => {
          console.log(response.data.floatingip);
          this.getFloatings();
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
    getRules() {
      axios
        .get("http://localhost:3000/api/security-groups/rules", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
          },
        })
        .then((response) => {
          console.log(response);
          this.rules = response.data.security_group_rules;
          this.security_group_rule.security_group_id = this.rules[0].security_group_id;
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Machines";
        });
    },
    createRules() {
      axios
        .post(
          "http://localhost:3000/api/security-groups/rules",
          this.security_group_rule,
          {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.address,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.rules = response.data.security_group_rules;
          this.security_group_rule.security_group_id = this.rules[0].security_group_id;
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Machines";
        });
    },
    easyConnect() {
      axios
        .post(
          "http://localhost:3000/api/security-groups/rules",
          {
            security_group_rule: {
              direction: "ingress",
              port_range_min: "22",
              ethertype: "ipv4",
              port_range_max: "22",
              protocol: "tcp",
              security_group_id: this.rules[0].security_group_id,
              remote_ip_prefix: "0.0.0.0/0",
            },
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

          setTimeout(() => {
            axios
              .post("http://localhost:3000/api/security-groups/rules", {
                security_group_rule: {
                  direction: "ingress",
                  port_range_min: "8",
                  ethertype: "ipv4",
                  port_range_max: "0",
                  protocol: "icmp",
                  security_group_id: this.rules[0].security_group_id,
                  remote_ip_prefix: "0.0.0.0/0",
                },
                headers: {
                  "X-Token": this.$store.state.authToken,
                  "X-Server-Address": this.address,
                },
              })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error.response);
                this.errorMessage = error.response.data.message;
                this.errorMessage = "Error in Creating Rule";
              });
          }, 1000);
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Creating Rule";
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
