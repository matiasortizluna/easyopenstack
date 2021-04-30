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
    .then((resp) => { res.send(resp.data) })

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
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/security-groups'
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => { res.send(resp.data); })

    .catch((err) => {

      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
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
  axios.get(data['x-server-address'] + '/image/v2/images/' + req.params.imageId, {
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
  let headers = req.headers
  axios.get(headers['x-server-address'] + "/compute/v2.1/os-keypairs", {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => { res.send(resp.data); })
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getNetworks = (req, res, next) => {
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/networks'
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {

      res.send(resp.data);
    })
    .catch((err) => {

      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
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
  let selectedSecGroups = [] 
  let selectedNetworks = []
  //Creating Secutiry Groups Array
  data["X-Security-Groups"].forEach(secGroup => {
      selectedSecGroups.push({"name": secGroup.name})
  })
  //CREATING NETWORKS ARRAY
  data['X-Networks'].forEach(network => {
      selectedNetworks.push({"uuid": network.id})
  })
  let server = {
      "name": data['X-Machine-Name'],
      "imageRef": data['X-Image'],
      "flavorRef": headers['x-server-address']+"/compute/v2/flavors/" + data['X-Flavor'],
      "networks": selectedNetworks,
      "description": data['"X-Description"'],
      "security_groups": selectedSecGroups,
  }
  if(data['X-KeyPairs'])
    server.key_name = data['X-KeyPairs']

  axios.post(headers['x-server-address'] + '/compute/v2.1/servers', {
    server
  }, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp.data);
      res.send(resp.data);
    })
    .catch((err) => {
      console.log(err)
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        //console.log(err)
        res.status(err.response.status).send({ message: err.response.statusText, data: err })
      }
    })
}
module.exports.deleteMachine = (req, res, next) => {
  let headers = req.headers
  //console.log(headers)
  axios.delete(headers['x-server-address'] + '/compute/v2.1/servers/' + req.params.machineId, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp.data);
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
module.exports.changeMachineState = (req, res, next) => {
  let headers = req.headers
  axios.post(headers['x-server-address'] + '/compute/v2.1/servers/' + req.params.machineId+'/action', req.body, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp.data);
      res.status(resp.status).send(resp.data);
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
module.exports.deleteImage = (req, res, next) => {
  let headers = req.headers
  //console.log(headers)
  axios.delete(headers['x-server-address'] + '/image/v2/images/' + req.params.imageId, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp.data);
      res.send(resp.data);
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        //console.log(err.response)
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.deleteVolume = (req, res, next) => {
  let headers = req.headers
  //console.log(headers)
  axios.delete(headers['x-server-address'] + '/volume/v3/' + headers['x-project-id'] + '/volumes/' + req.params.volumeId, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp.data);
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
module.exports.getFloatings = (req, res, next) => {
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/floatingips'
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp)
      res.send(resp.data);
    })
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getPorts = (req, res, next) => {
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/ports'
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp)
      res.send(resp.data);
    })
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getInstanceDetails = (req, res, next) => {
  console.log(req)
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/servers/' + req.params.instanceId, {
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
module.exports.associatePortToFloating = (req, res, next) => {
  //console.log(req.headers)
  //console.log(req.body)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/floatingips/' + req.body['floatingip_id']
  axios.put(url, {
    "floatingip": {
      "port_id": req.body['port_id']
    }
  }, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp)
      res.send(resp.data);
    })
    .catch((err) => {
      //console.log(err)
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.getRules = (req, res, next) => {
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  let url = address + ':9696' + '/v2.0/security-group-rules'
  axios.get(url, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp)
      res.send(resp.data);
    })
    .catch((err) => {
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
module.exports.createRule = (req, res, next) => {
  //console.log(req.headers)
  let address = req.headers['x-server-address']
  console.log(req.body.security_group_rule)
  let url = address + ':9696' + '/v2.0/security-group-rules'
  axios.post(url, {
    security_group_rule: {
      direction: req.body.security_group_rule.direction,
      port_range_min: req.body.security_group_rule.port_range_min,
      ethertype: req.body.security_group_rule.ethertype,
      port_range_max: req.body.security_group_rule.port_range_max,
      protocol: req.body.security_group_rule.protocol,
      security_group_id: req.body.security_group_rule.security_group_id,
      remote_ip_prefix: req.body.security_group_rule.remote_ip_prefix,
    }
  }, {
    headers: {
      'X-Auth-Token': req.headers['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp)
      res.send(resp.data);
    })
    .catch((err) => {
      //console.log(err)
      if (err.response == undefined) {
        res.status(400).send({ message: "ERRO ON NODE", data: err, status: 409 })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}



//---------------------------------------------------------------- HEAT ----------------------------------------------------
module.exports.getHeatStacks = (req, res, next) => {
  let data = req.headers

  axios.post(data['x-server-address'] + "/compute/v2.1/os-keypairs", {
    "keypair": {
      "name": "heat_keypair"
    }
  }, {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => {
      getStacks(data, res, resp.data.keypair.private_key)
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        if (err.response.status == 409) {
          getStacks(data, res)
        }

      }
    })
}

function getStacks(data, res, privKey = null) {
  axios.get(data['x-server-address'] + "/heat-api/v1/" + data['x-project-id'] + "/stacks", {
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

module.exports.deleteStack = (req, res, next) => {
  let data = req.headers
  axios.delete(data['x-server-address'] + "/heat-api/v1/" + data['x-project-id'] + "/stacks/" + req.params.stackName + "/" + req.params.stackId, {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => {
      //console.log(resp);
      res.send({ message: "Stack '" + req.params.stackName + "' deleted successfuly!" });
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        //console.log(err)
        res.status(err.response.status).send({ message: err.response.data.error })
      }
    })
}
module.exports.createStack = (req, res, next) => {
  let headers = req.headers
  let data = req.body
  axios.post(headers['x-server-address'] + "/heat-api/v1/" + headers['x-project-id'] + "/stacks", {
    "stack_name": data.stack_name,
    "template_url": data.template_url,
    "timeout_mins": parseInt(data.timeout_mins)
  }, {
    headers: {
      'X-Auth-Token': headers['x-token']
    }
  })
    .then((resp) => {
      res.status(201).send(resp.response)
    })
    .catch((err) => {
      if (err.response == undefined) {
        //console.log(err)
        res.status(400).send({ message: "ERRO ON NODE", data: err })
      }
      else {
        res.status(err.response.status).send({ message: err.response.statusText })
      }
    })
}
//------------------------------------------- END HEAT -------------------------------------------------------