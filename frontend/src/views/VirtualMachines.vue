<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Virtual Machines</h3>
      <br />
      <p>Flaoating IPs are in red</p>

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
                <div
                  v-for="(network, networkName) in machine.addresses"
                  :key="network"
                >
                  <p
                    v-for="address in network"
                    :key="address.addr"
                    :class="
                      address['OS-EXT-IPS:type'] != 'floating'
                        ? 'text-gray-700'
                        : 'text-red-700 font-weight-bold'
                    "
                  >
                    &nbsp;&nbsp;<strong>{{ networkName }}</strong>
                    {{ address.addr }}
                  </p>
                </div>
                <p class="text-gray-700">
                  <strong>Power state: </strong
                  >{{ powerStates[machine["OS-EXT-STS:power_state"]] }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ machine.status }}
                </div>
                <br />
                <div class="row">
                  <div class="col-md-4">
                    <button
                      type="button"
                      class="btn btn-warning"
                      @click="toggleModal(machine)"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deleteMachine(machine)"
                    >
                      Delete
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button
                      type="button"
                      :class="
                        machine.status == 'SHUTOFF'
                          ? 'btn btn-success'
                          : 'btn btn-danger'
                      "
                      @click="changeMachineState(machine)"
                    >
                      {{ machine.status == 'SHUTOFF' ? 'Start' : machine.status == 'ACTIVE' ? 'Stop' : 'Wait' }}
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
                  An old machine will be changed :(
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
                          v-bind:placeholder="this.machineEditing.project"
                          v-bind:value="this.machineEditing.project"
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
                          v-model="this.machineEditing.name"
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
                      v-bind:placeholder="this.machineEditing.description"
                      v-model="this.machineEditing.description"
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
                          v-bind:placeholder="this.machineEditing.image_file.id"
                          disabled
                          v-model="this.machineEditing.image_file.id"
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
                          v-model="this.machineEditing.flavor"
                        >
                          <option
                            v-for="flavor in flavors"
                            v-bind:key="flavor.id"
                            v-bind:value="flavor.id"
                            :selected="
                              flavor.id == this.machineEditing.flavor.id
                            "
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
                        <label>Select Storage</label><br />
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          v-model="this.machineEditing.storage"
                        >
                          <option
                            v-for="volume in volumes"
                            v-bind:key="volume.id"
                            v-bind:value="volume.id"
                            :selected="
                              volume.id == this.machineEditing.storage.id
                            "
                          >
                            {{ volume.name }}
                          </option>
                        </select>
                        <small id="emailHelp" class="form-text text-muted"
                          >Storage associated to this machine</small
                        >
                      </div>

                      <div class="col">
                        <label>Select Key Pair</label>
                        <br />
                        <select
                          class="form-select"
                          aria-label="KeyPair Selected"
                          v-model="this.machineEditing.key_pair"
                        >
                          <option
                            v-for="keyPair in this.keyPairs"
                            v-bind:key="keyPair.keypair.name"
                            v-bind:value="keyPair.keypair.name"
                            :checked="
                              keyPair.keypair.name ==
                              this.machineEditing.key_pair
                            "
                          >
                            {{ keyPair.keypair.name }}
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

                        <div
                          v-for="(network, index) in networks"
                          v-bind:key="network.id"
                          class="form-check"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-bind:value="network"
                            v-model="this.machineEditing.networks"
                            id="checkNetwork"
                            :checked="
                              network.name ==
                              this.machineEditing.networks[index]
                            "
                          />
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
                            {{ network.name }}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <label for="exampleInputPassword1"
                          >Select Security Group</label
                        >

                        <div
                          v-for="(security, index) in this.securityGroups"
                          v-bind:key="security.id"
                          class="form-check"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-bind:value="security"
                            v-model="this.machineEditing.security_groups"
                            id="checkSecurityGroup"
                            :checked="
                              security.name ==
                              this.machineEditing.security_groups[index].name
                            "
                          />
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
                            {{ security.name }}
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
                <br />
                <button
                  type="submit"
                  class="btn btn-success"
                  @click="editMachine(machine)"
                >
                  Save Changes
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
      flavors: [],
      volumes: [],
      images: [],
      securityGroups: [],
      keyPairs: [],
      networks: [],
      powerStates: {
        0: "NOSTATE",
        1: "RUNNING",
        3: "PAUSED",
        4: "SHUTDOWN",
        6: "CRASHED",
        7: "SUSPENDED",
      },
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
      address: "",
      machineEditing: {
        project: "",
        name: "",
        description: "",
        image_file: "",
        flavor: "",
        storage: [],
        key_pair: "",
        networks: [],
        security_groups: [],
      },
      for_MachineFloatingip: {},
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
    };
  },
  methods: {
    getForEditing(machine) {
      this.getDetailsFromMachine(machine);
      this.getFlavors();
      this.getInfoVolumes();
      this.getNetworks();
      this.getSecurityGroups();
      this.getKeyPairs();
      setTimeout(() => {
        this.message = "";
      }, 1000);
    },
    toggleModal(machine) {
      this.message = "Waiting for verify information ... ";
      this.getForEditing(machine);
      setTimeout(() => {
        if (this.errorMessage == "" && this.errorMessageModal == "") {
          $("#modalCreate").modal("toggle");
        }
      }, 1000);
    },
    editMachine(machine) {
      this.errorMessageModal = "";
      this.messageModal = "Changing machine ...";
      axios
        .post(
          "http://localhost:3000/api/instances",
          {
            "X-Machine-Name": this.machineEditing.name,
            "X-Image": this.machineEditing.image_file.id,
            "X-Flavor": this.machineEditing.flavor,
            "X-Networks": this.machineEditing.networks,
            "X-Description": this.machineEditing.description,
            "X-Security-Groups": this.machineEditing.security_groups,
            "X-KeyPairs": this.machineEditing.key_pair,
            "X-Volume": this.machineEditing.storage,
          },
          {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.$store.state.url,
            },
          }
        )
        .then((response) => {
          //this.messageModal = "Machine  Sucessfully!";
          this.machineEditing = {
            project: "",
            name: "",
            description: "",
            image_file: "",
            flavor: "",
            storage: [],
            key_pair: "",
            networks: [],
            security_groups: [],
          };
          setTimeout(() => {
            this.toggleModal();
          }, 500);
          this.message = "Machine Changed Sucessfully!";
        })
        .catch((error) => {
          this.errorMessageModal = error.response.data.message;
        });
    },
    getDetailsFromMachine(machine) {
      axios
        .get("http://localhost:3000/api/instances/" + machine.id + "/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.machineEditing.project = "";
          this.machineEditing.name = response.data.server.name;
          this.machineEditing.image_file = response.data.server.image;
          this.machineEditing.flavor = response.data.server.flavor;
          this.machineEditing.storage =
            response.data.server["os-extended-volumes:volumes_attached"];
          this.machineEditing.key_pair = response.data.server.key_name;
          this.machineEditing.security_groups =
            response.data.server.security_groups;

          this.machineEditing.networks = response.data.server.addresses;
        })
        .catch((error) => {
          this.errorMessage = "Error in Getting + information about Instances";
        });
    },
    deleteMachine(machine) {
      axios
        .delete("http://localhost:3000/api/instances/" + machine.id, {
          headers: {
            "x-token": this.$store.state.authToken,
            "x-server-address": this.$store.state.url,
          },
        })
        .then((response) => {
          //console.log("RESPONSE" + response);
          let deletedMachine = response.data.server;
          this.message =
            "Deleted Machine" + deletedMachine.name + "Successfully.";
          setTimeout(() => {
            this.getInfoMachines();
          }, 2000);
        })
        .catch((error) => {
          //this.error = error.response.data.message;
          this.errorMessage =
            "Error in Deleting Machine. Try again or refresh :)";
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
      this.message = "";
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
    getFlavors() {
      axios
        .get("http://localhost:3000/api/flavors/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.flavors = response.data.flavors;
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Flavors";
        });
    },
    getInfoVolumes() {
      axios
        .get("http://localhost:3000/api/volumes/detail", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject,
          },
        })
        .then((response) => {
          this.volumes = response.data.volumes.reverse();
          this.message =
            this.volumes.length == 0 ? "There are no Volumes created." : "";
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Volumes";
        });
    },
    getSecurityGroups() {
      axios
        .get("http://localhost:3000/api/security-groups", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
          },
        })
        .then((response) => {
          this.securityGroups = response.data["security_groups"];
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage =
            "Error in Getting information about Security-Groups";
        });
    },
    getKeyPairs() {
      axios
        .get("http://localhost:3000/api/keypairs", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.keyPairs = response.data["keypairs"];
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Key Pairs";
        });
    },
    getNetworks() {
      axios
        .get("http://localhost:3000/api/networks", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
          },
        })
        .then((response) => {
          //console.log(response);
          this.networks = response.data["networks"];
        })
        .catch((error) => {
          //console.log(error);
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Networks";
        });
    },
    getInfoImages() {
      axios
        .get("http://localhost:3000/api/images", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
            "X-Project-Id": this.$store.state.selectedProject,
          },
        })
        .then((response) => {
          response.data.images.forEach((element) => {
            this.images.push(element);
          });
          this.message =
            this.images.length == 0 ? "There are no Images created." : "";
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Images";
        });
    },
    changeMachineState(machine) {
      let body = {};
      if (machine.status == "SHUTOFF") {
        body = {
          'os-start': null
        }
      }else if(machine.status == "ACTIVE"){
        body = {
          "os-stop": null,
        };
      }
      axios
        .post("http://localhost:3000/api/instances/" + machine.id, body, {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.$store.state.url,
          },
        })
        .then((response) => {
          this.message = "Changing machine state...";
          setTimeout(this.getInfoMachines, 4000);
        })
        .catch((err) => console.log(err.response));
    },
    createConnection(machine) {
      //console.log(machine);
      this.getNetworks();
      setTimeout(() => {
        this.getRules();
      }, 1000);
      setTimeout(() => {
        this.getPortsFromMachine(machine);
      }, 1000);
    },
    createFloatingIP(machine) {
      //console.log(this.networks);
      let network_id = this.networks.find(
        (network) => network["router:external"] == true
      );

      axios
        .post(
          "http://localhost:3000/api/floating",
          {
            floatingip: {
              floating_network_id: network_id.id,
              project_id: this.$store.state.selectedProject,
            },
          },
          {
            headers: {
              "x-token": this.$store.state.authToken,
              "x-server-address": this.address,
            },
          }
        )
        .then((response) => {
          //console.log(response.data);
          this.message = "Created Floating IP Successfully. Now associating";
          machine.floatingip = response.data.floatingip;

          setTimeout(() => {
            this.associate(machine);
          }, 2000);
        })
        .catch((error) => {
          this.errorMessage = "Error in creating new Floating IP";
          //this.error = error.response.data.message;
        });
    },
    getPortsFromMachine(machine) {
      console.log(machine);
      let machine_id = machine.id;
      axios
        .get("http://localhost:3000/api/ports/machine", {
          headers: {
            "X-Token": this.$store.state.authToken,
            "X-Server-Address": this.address,
            "X-Server-Id": machine_id,
          },
        })
        .then((response) => {
          //response.data.ports.find(port => port.)
          machine.ports = response.data.ports;
          console.log(machine.ports);
          this.createFloatingIP(machine);
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          //console.log(error);
          this.errorMessage =
            "Error in Getting information about Floating Points. Can't create Floating Point. Try again :)";
        });
    },
    associate(machine) {
      console.log(machine.ports);
      var index = 0;
      var count = 0;
      machine.ports.forEach((port) => {
        if (port.fixed_ips.length > 1) {
          index = count;
        }
        count++;
      });

      axios
        .put(
          "http://localhost:3000/api/floating/port",
          {
            floatingip_id: machine.floatingip.id,
            port_id: machine.ports[index].id,
          },
          {
            headers: {
              "X-Token": this.$store.state.authToken,
              "X-Server-Address": this.address,
            },
          }
        )
        .then((response) => {
          //console.log(response);
          this.message = "Associated Floating IP with Machine Successfully :)";

          setTimeout(() => {
            this.getInfoMachines();
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Associating Floating IP to Machine";
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
          //console.log(response);
          this.rules = response.data.security_group_rules;
          this.security_group_rule.security_group_id = this.rules[0].security_group_id;

          var do_it = true;
          var ruleAlready = this.rules.find(
            (rule) => rule.protocol == "tcp" && rule.port_range_min == 22
          );
          if (ruleAlready) {
            do_it = false;
          }

          if (do_it) {
            this.easyConnect();
          } else {
            this.message =
              "Already Configured SSH & ICMP Security Group Rules, Skipiing ...";
          }
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage =
            "Error in Getting information about Security Group Rules";
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
              security_group_id: this.security_group_rule.security_group_id,
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
          this.message = "Created SSH Security Group Rule Successfully";
          //console.log(response);
          //console.log("almost");

          setTimeout(() => {
            axios
              .post(
                "http://localhost:3000/api/security-groups/rules",
                {
                  security_group_rule: {
                    direction: "ingress",
                    port_range_min: "8",
                    ethertype: "ipv4",
                    port_range_max: "0",
                    protocol: "icmp",
                    security_group_id: this.security_group_rule
                      .security_group_id,
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
                this.message = "Created ICMP Security Group Rule Successfully";
                //console.log("The End");
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
    this.getInfoMachines();
    this.getInfoImages();
    var ip_address = this.$store.state.url.split(":");
    this.address = ip_address[0] + ":" + ip_address[1];
    this.machineEditing.project = this.$store.state.selectedProjectName;
  },
};
</script>
