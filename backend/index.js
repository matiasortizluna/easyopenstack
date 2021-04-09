var axios = require('axios')
const express = require('express')

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port
    // Starting the Server at the port 3000
})
//get token
app.post('/api/token', (req, res, next) => {
  let data = req.body
  axios.post(data.server_address+'/identity/v3/auth/tokens', {
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
      res.send({token:resp.headers['x-subject-token']})
    })
    .catch((err) => {
      if(err.response==undefined)
        res.status(400).send({message:"Unable to connect to the server"})
      else
        res.status(err.response.data.error.code).send({message: err.response.data.error.message})
    })
})
