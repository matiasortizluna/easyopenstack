<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Deploy (Click on an image)</h3>

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
          <div class="col-md-3" v-for="image in images" :key="image.id">
            <div class="card" style="width: 18rem">
              <div class="card-body" @click="toggleModal(image)">
                <img
                  class="rounded mx-auto d-block w-20"
                  :src="image.img == undefined ? cdPNG : image.img"
                />
                <h5 class="card-title text-center font-weight-bold">
                  {{ image.name }}
                </h5>
                <p class="mt-2 text-gray-700">
                  Format: {{ image.disk_format }}
                </p>
                <p class="text-gray-700">
                  Size: {{ image.size * 0.00000095367432 }}
                </p>
                <p class="text-gray-700">
                  Created at: {{ formatDate(image.created_at) }}
                </p>
                <p class="text-gray-700">
                  Updated at: {{ formatDate(image.updated_at) }}
                </p>
                <div class="text-black-800 font-weight-bold">
                  Status: {{ image.status }}
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
                    </div>

                    <div class="col">
                      <label>Select Key Pair</label>
                      <br />
                      <select
                        class="form-select"
                        aria-label="KeyPair Selected"
                        v-model="this.machineCreating.key_pair"
                      >
                        <option
                          v-for="keyPair in this.keyPairs"
                          v-bind:key="keyPair.keypair.name"
                          v-bind:value="keyPair.keypair.name"
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
                      <label for="exampleInputPassword1">Select Network</label>

                      <div
                        v-for="network in networks"
                        v-bind:key="network.id"
                        class="form-check"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-bind:value="network"
                          v-model="this.machineCreating.networks"
                          id="checkNetwork"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
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
                        v-for="security in this.securityGroups"
                        v-bind:key="security.id"
                        class="form-check"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-bind:value="security"
                          v-model="this.machineCreating.security_groups"
                          id="checkSecurityGroup"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
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
  </main>
</template>
<script>
import server from "../assets/images/server.png";
import windows from "../assets/images/windows.png";
import linux from "../assets/images/linux.png";
import cirros from "../assets/images/cirros.png";
import cd from "../assets/images/cd.png";
export default {
  data() {
    return {
      serverPNG: server,
      cdPNG: cd,
      flavors: [],
      volumes: [],
      images: [],
      securityGroups: [],
      keyPairs: [],
      networks: [],
      address: "",
      machineCreating: {
        project: "",
        name: "",
        description: "",
        image_file: "",
        flavor: "",
        key_pair: "",
        networks: [],
        security_groups: [],
      },
      images: [],
      errorMessage: "",
      message: "Loading...",
      errorMessageModal: "",
      messageModal: "",
    };
  },
  methods: {
    toggleModal(image) {
      //console.log(this.machineCreating.project);
      this.machineCreating.image_file = image;
      this.message = "Waiting for verify information ... ";
      setTimeout(() => {
        this.getForDeploy();
        if (this.errorMessage == "" && this.errorMessageModal == "") {
          //this.messageModal = "";
          //this.errorMessageModal = "";
          //this.volumeName = this.volumeDescription = this.volumeSource = this.volumeSize = null;
          $("#modalCreate").modal("toggle");
        }
      }, 1000);
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
          this.networks = response.data["networks"];
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Networks";
        });
    },
    getForDeploy() {
      this.getFlavors();
      this.getInfoVolumes();
      this.getNetworks();
      this.getSecurityGroups();
      this.getKeyPairs();
      setTimeout(() => {
        this.message = "";
        //this.machineCreating.networks = this.networks;
      }, 1000);
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
          this.images = response.data.images;
          this.images.forEach((image) => {
            if (image.name.toLowerCase().includes("windows")) {
              image.img = windows;
            } else if (
              image.name.toLowerCase().includes("ubuntu") ||
              image.name.toLowerCase().includes("linux") ||
              image.name.toLowerCase().includes("unix")
            ) {
              image.img = linux;
            } else if (image.name.toLowerCase().includes("cirro")) {
              image.img = cirros;
            }
          });
          this.message =
            this.images.length == 0 ? "There are no Images created." : "";
        })
        .catch((error) => {
          //this.errorMessage = error.response.data.message;
          this.errorMessage = "Error in Getting information about Images";
        });
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
    deployMachine() {
      if (
        this.machineCreating.name &&
        this.machineCreating.image_file &&
        this.machineCreating.flavor
      ) {
        this.errorMessageModal = "";
        this.messageModal = "Creating machine ...";
        axios
          .post(
            "http://localhost:3000/api/instances",
            {
              "X-Machine-Name": this.machineCreating.name,
              "X-Image": this.machineCreating.image_file.id,
              "X-Flavor": this.machineCreating.flavor,
              "X-Networks": this.machineCreating.networks,
              "X-Description": this.machineCreating.description,
              "X-Security-Groups": this.machineCreating.security_groups,
              "X-KeyPairs": this.machineCreating.key_pair,
            },
            {
              headers: {
                "X-Token": this.$store.state.authToken,
                "X-Server-Address": this.$store.state.url,
              },
            }
          )
          .then((response) => {
            this.machineCreating = {
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
            this.message = "Machine Created Sucessfully!";
          })
          .catch((error) => {
            console.log(error)
            this.errorMessageModal = error.response.data.message;
          });
      } else {
        this.errorMessageModal = "All fields are required!";
      }
    },
  },
  mounted() {
    this.getInfoImages();
    var ip_address = this.$store.state.url.split(":");
    this.address = ip_address[0] + ":" + ip_address[1];
    this.machineCreating.project = this.$store.state.selectedProjectName;
  },
};
</script>