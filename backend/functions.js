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

              res.send({ token: resp.headers['x-subject-token'], projectId: resp.data.token.project.id })
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
      res.send({ token: resp.headers['x-subject-token'], projectId: resp.data.token.project.id })
    })
    .catch((err) => {
      //console.log(err)
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
    .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
}
//res.status(err.response.data.error.code).send({message: err.response.data.error.message})
module.exports.getInstances = (req, res, next) => {

  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/servers', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
}
module.exports.getInstancesDetail = (req, res, next) => {

  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/servers/detail', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => { res.send(resp.data) })
    .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
}
module.exports.getVolumes = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/volume/v3/' + data['x-project-id'] + '/volumes', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => {
      res.status(err.response.data.badRequest.code).send({ message: err.response.data.badRequest.message })
    })

}
module.exports.getImages = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2/images', {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))

}

module.exports.getFlavor = (req, res, next) => {
  let data = req.headers
  axios.get(data['x-server-address'] + '/compute/v2.1/flavors/'+req.params.flavorId, {
    headers: {
      'X-Auth-Token': data['x-token']
    }
  })
    .then((resp) => res.send(resp.data))
    .catch((err) => res.status(err.response.data.error.code).send({ message: err.response.data.error.message }))
}