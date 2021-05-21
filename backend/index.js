const express = require('express')

const app = express();
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Server-Address, x-project-id, X-Old-Token, X-New-Project-Id, X-Server-Port, X-Machine-Name, X-Image, X-Flavor, X-Networks,X-Server-Id")
  next()
})

const server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  // Starting the Server at the port 3000
})
//Import all custom functions
let importedK8sFunctions = require('./kubernetes.js');
//importedK8sFunctions.createNamespace()
app.get("/api/checkkubeconfig", importedK8sFunctions.checkKubeconfig);
app.post("/api/uploadkubeconfig", importedK8sFunctions.uploadKubeconfig);
app.get("/api/nodes", importedK8sFunctions.getNodes);
app.get("/api/namespaces", importedK8sFunctions.getNamespaces);
app.get("/api/pods", importedK8sFunctions.getPods);
app.get("/api/deployments", importedK8sFunctions.getDeployments);
app.get("/api/services", importedK8sFunctions.getServices);

app.delete("/api/deployments/:namespace/:name", importedK8sFunctions.deleteDeployment);
app.delete("/api/namespaces/:namespace", importedK8sFunctions.deleteNamespace);
app.delete("/api/nodes/:name", importedK8sFunctions.deleteNode);

app.post("/api/namespaces", importedK8sFunctions.createNamespace);
