var axios = require('axios')
//GET FIRST SCOPED TOKEN
module.exports.getFirstScopedToken = (req, res, next) => {
  let data = req.body
  axios.post(data.server_address + '/identity/v3/auth/tokens', {
    "auth": {
      "identity": {
        "methods": ["password"],
        "password": {
          "user": {
            "name": data.username,
            "domain": { "id": "default" },
            "password": data.password
          }
        }
      }
    }
  })
    .then((resp) => {
      let unscopedToken = resp.headers['x-subject-token']
      axios.get(data.server_address + '/identity/v3/auth/projects', {
        headers: {
          'X-Auth-Token': unscopedToken
        }
      })
        .then((resp) => {
          if (!resp.data.projects.length) {
            res.status(404).send({ message: "There are no projects associated with this user." })
            return
          }
          let firstProjectId = resp.data.projects[0].id
          axios.post(data.server_address + '/identity/v3/auth/tokens', {
            "auth": {
              "identity": {
                "methods": [
                  "token"
                ],
                "token": {
                  "id": unscopedToken
                }
              },
              "scope": {
                "project": {
                  "id": firstProjectId
                }
              }
            }
          })
            .then((resp) => {
              res.send({ token: resp.headers['x-subject-token'], projectId: resp.data.token.project.id, projectName: resp.data.token.project.name })
            })
            .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
        })
        .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
    })
    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "Unable to connect to the server" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.changeScopedToken = (req, res, next) => {
  let data = req.headers
  axios.post(data['x-server-address'] + '/identity/v3/auth/tokens', {
    "auth": {
      "identity": {
        "methods": [
          "token"
        ],
        "token": {
          "id": data['x-old-token']
        }
      },
      "scope": {
        "project": {
          "id": data['x-new-project-id']
        }
      }
    }
  })
    .then((resp) => {
      res.send({ token: resp.headers['x-subject-token'], projectId: resp.data.token.project.id, projectName: resp.data.token.project.name })
    })
    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.getProjects = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/identity/v3/auth/projects', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}

module.exports.getInstances = (req, res, next) => {

  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/servers', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.getInstancesDetail = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/servers/detail', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => { res.send(resp.data)})

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.getVolumes = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/volume/v3/' + data['x-project-id'] + '/volumes', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => { res.send(resp.data) })

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.getVolumesWithDetail = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/volume/v3/' + data['x-project-id'] + '/volumes/detail', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.data.error.code).send({ message: err.response.data.error.message })
    })
}
module.exports.getSecurityGroups = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + ':9696' + '/v2/security-groups', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE" })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getImages = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/image/v2/images', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.status).send({ message: err.response.statusText })
    })

}
module.exports.getImage = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/image/v2/images/'+req.params.imageId, {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => {
      res.send(resp.data)

    })
    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.status).send({ message: err.response.statusText })
    })

}
module.exports.getFlavor = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/flavors/' + req.params.flavorId, {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE" })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getFlavorsDetail = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/flavors/detail', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE" })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getKeyPairs = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + ':9696' + '/v2/os-keypairs', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE" })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getNetworks = (req, res, next) => {
  let data = req.headers['x-server-address']
  console.log(data)
  let url = data + ':9696' + '/v2.0/networks'
  console.log(url)
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp);
      res.send(resp.data);
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        //console.log(err)
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}

module.exports.addImage = (req, res, next) => {
  let headers = req.headers
  let data = req.body
  axios.post(headers['x-server-address'] + '/image/v2/images', {
    "container_format": "bare",
    "disk_format": data.diskFormat,
    "name": data.imageName,
    "min_disk": parseInt(data.minDisk),
    "min_ram": parseInt(data.minRam),
  }, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      axios.post(headers['x-server-address'] + '/image/v2/images/' + resp.data.id + '/import', {
        "method": {
          "name": "web-download",
          "uri": data.imageURI
        },
        "all_stores": true,
        "all_stores_must_succeed": true
      }, {
        headers: {
          'X-Auth-Token': headers['x-token']
        }
      })
        .then((resp) => {
          res.send(resp.data)
        })
        .catch((err) => {
          axios.delete(headers['x-server-address'] + '/image/v2/images/' + resp.data.id, {
            headers: {
              'X-Auth-Token': headers['x-token']
            }
          })
          if (err.response == undefined) {
            res.status(400).send({ message: "ERRO ON NODE" })
          }
          else {
            res.status(err.response.status).send({ message: err.response.statusText })
          }
        })
    })
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE" })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.addVolume = (req, res, next) => {
  let headers = req.headers
  let data = req.body
  axios.post(headers['x-server-address'] + '/volume/v3/' + headers['x-project-id'] + '/volumes', {
    "volume": {
      "size": data.volumeSize,
      "multiattach": false,
      "name": data.volumeName,
      "imageRef": data.volumeSource,
      "description": data.volumeDescription,
      "volume_type": "lvmdriver-1"
    }
  }, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => res.send(resp.data))

    .catch((err) => {
      if (err.response == undefined)
        res.status(400).send({ message: "ERRO ON NODE" })
      else
        res.status(err.response.status).send({ message: err.response.statusText })
    })
}
module.exports.createMachine = (req, res, next) => {
  let headers = req.headers
  let data = req.body
  console.log(req)
  axios.post(headers['x-server-address'] + '/compute/v2.1/servers', {
    "server": {
      "name": data['X-Machine-Name'],
      "imageRef": data['X-Image'],
      "flavorRef": "http://openstack.example.com/flavors/" + data['X-Flavor'],
      "networks": [{ "uuid": data['X-Networks'][0].id }]
    },
  }, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => { console.log(resp); res.send(resp.data); })
    .catch((err) => {
      if (err.response == undefined) {
        console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        console.log(err)
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}

//---------------------------------------------------------------- HEAT ----------------------------------------------------
module.exports.getHeatStacks = (req, res, next) => {
  let data = req.headers
  axios.post(data['x-server-address']+"/compute/v2.1/os-keypairs", {
      "keypair": {
          "name": "heat_keypair"
      }
    },{
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => {
      getStacks(data,res, resp.data.keypair.private_key)
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        if(err.response.status == 409){
          getStacks(data,res)
        }
          
      }
    })
}

function getStacks(data, res, privKey = null){
  axios.get(data['x-server-address']+"/heat-api/v1/"+data['x-project-id']+"/stacks", {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp);
      let stacks = resp.data
      stacks.private_key = privKey
      res.send(stacks);
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        //console.log(err)
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
//------------------------------------------- END HEAT -------------------------------------------------------