const express = require('express')

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Server-Address, x-project-id, X-Old-Token, X-New-Project-Id, X-Server-Port, X-Machine-Name, X-Image, X-Flavor, X-Networks")
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
app.get('/api/volumes/detail', importedFunctions.getVolumesWithDetail)
app.get('/api/security-groups', importedFunctions.getSecurityGroups)
app.get('/api/images', importedFunctions.getImages)
app.get('/api/images/:imageId', importedFunctions.getImage)
app.get('/api/flavor/:flavorId', importedFunctions.getFlavor)
app.get('/api/flavors/detail', importedFunctions.getFlavorsDetail)
app.get('/api/keypairs', importedFunctions.getKeyPairs)
app.get('/api/networks', importedFunctions.getNetworks)
app.post('/api/images', importedFunctions.addImage)
app.post('/api/volumes', importedFunctions.addVolume)
app.post('/api/instances', importedFunctions.createMachine)

//HEAT
app.get('/api/heat/stacks', importedFunctions.getHeatStacks)
app.post('/api/heat/stacks', importedFunctions.createStack)
app.delete('/api/heat/stacks/:stackName/:stackId', importedFunctions.deleteStack)