<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
    <div class="container mx-auto px-6 py-8">
      <h3 class="text-gray-700 text-3xl font-medium">Deploy</h3>

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
              <div class="card-body" @click="showModal(image)">
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
                        v-bind:placeholder="machineCreating.image_file"
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
import cd from "../assets/images/cd.png";
export default {
  data() {
    return {
      serverPNG: server,
      selectedProjectName: "",
      cdPNG: cd,
      machineCreating: {
        project: this.$store.state.selectedProjectName,
        name: "",
        description: "",
        image_file: "",
      },
      images: [
        {
          created_at: "2021-04-08T15:11:30Z",
          disk_format: "iso",
          name: "Windows Server 2019",
          size: 990904320,
          status: "active",
          updated_at: "2021-04-08T15:11:42Z",
          img: windows,
        },
        {
          created_at: "2021-04-08T15:11:30Z",
          disk_format: "iso",
          name: "Cirros",
          size: 990904320,
          status: "active",
          updated_at: "2021-04-08T15:11:42Z",
          img: cirros,
        },
        {
          created_at: "2021-04-08T15:11:30Z",
          disk_format: "iso",
          name: "Ubuntu Server 18.04",
          size: 990904320,
          status: "active",
          updated_at: "2021-04-08T15:11:42Z",
          img: linux,
        },
      ],
      errorMessage: "",
      message: "Loading...",
    };
  },
  methods: {
    showModal(image) {
      console.log(image);
      this.machineCreating.image_file = image.name;
      $("#modalCreate").modal("show");
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
          this.error = error.response.data.message;
          console.log(error);
        });
    },
    formatDate(date) {
      let dateObject = new Date(date);
      return dateObject.toLocaleString();
    },
  },
  mounted() {
    this.getInfoImages();
  },
  computed: {
    selectedProjectName() {
      return this.$store.state.selectedProjectName;
    },
  },
};
</script>
