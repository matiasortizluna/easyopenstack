const express = require('express')

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Server-Address, x-project-id, X-Old-Token, X-New-Project-Id")
  next()
})

const server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  // Starting the Server at the port 3000
})
//Import all custom functions
let importedFunctions = require('./functions.js')
//get token
app.post('/api/token', importedFunctions.getFirstScopedToken)
app.get('/api/token/changeScope', importedFunctions.changeScopedToken)
app.get('/api/projects', importedFunctions.getProjects)
app.get('/api/instances', importedFunctions.getInstances)
app.get('/api/instances/detail', importedFunctions.getInstancesDetail)
app.get('/api/volumes', importedFunctions.getVolumes)
app.get('/api/images', importedFunctions.getImages)
