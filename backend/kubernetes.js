const k8s = require('@kubernetes/client-node');
const fs = require('fs');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
//Required because some endpoint don't exists in the CoreV1Api
const k8sApiBeta = kc.makeApiClient(k8s.AppsV1Api);

module.exports.getPods = () => {
    k8sApi.listNamespacedService('default').then((res) => {
        console.log(res.body);
    })

    /*k8sApi.listNamespacedPod('default').then((res) => {
        console.log(res.body.items[0].status);
    })*/
}

module.exports.uploadKubeconfig = (req, res) => {
    var kubeconfig = req.files.kubeconfig;
    if(!kubeconfig)
        return res.status(400).send({ "message":"File not found on request." });
    
    kubeconfig.mv('./k8s_config');
    res.send("")
}

module.exports.checkKubeconfig = (req, res) => {
    fs.readFile('k8s_config','utf8', function (err, data) {
        if(err){
            if (err.errno == -4058)
                return res.status(404).send( {"message": "KUBECONFIG file is not present! Please upload it."} );
            else
                return res.status(500).send( {"message": "Error on server."} );
        }
        var regex = /^apiVersion:/;
        if(regex.test(data))
            res.send("")
        else
            res.status(500).send({ "message":"File exists bue it's not valid. Upload a valid one." })
      });
}

module.exports.getNodes = (req, res) => {
    k8sApi.listNode().then((resp) => {
        res.send(resp.body.items);
    })
    .catch((err) => console.log(err))
}

module.exports.getNamespaces = (req, res) => {
    k8sApi.listNamespace().then((resp) => {
        res.send(resp.body.items);
    })
    .catch((err) => console.log(err));
}
module.exports.getPods = (req, res) => {
    k8sApi.listPodForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
    .catch((err) => console.log(err));
}
module.exports.getDeployments = (req, res) => {
    k8sApiBeta.listDeploymentForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
    .catch((err) => console.log(err));
}
module.exports.getServices = (req, res) => {
    k8sApi.listServiceForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
    .catch((err) => console.log(err));
}