const k8s = require('@kubernetes/client-node');
const fs = require('fs');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
//Required because some endpoints don't exists in the CoreV1Api
const k8sApiBeta = kc.makeApiClient(k8s.AppsV1Api);

module.exports.uploadKubeconfig = (req, res) => {
    var kubeconfig = req.files.kubeconfig;
    if (!kubeconfig)
        return res.status(400).send({ "message": "File not found on request." });

    kubeconfig.mv('./k8s_config');
    res.send("")
}

module.exports.checkKubeconfig = (req, res) => {
    fs.readFile('k8s_config', 'utf8', function (err, data) {
        if (err) {
            if (err.errno == -4058)
                return res.status(404).send({ "message": "KUBECONFIG file is not present! Please upload it." });
            else
                return res.status(500).send({ "message": "Error on server." });
        }
        var regex = /^apiVersion:/;
        if (regex.test(data))
            res.send("")
        else
            res.status(500).send({ "message": "File exists bue it's not valid. Upload a valid one." })
    });
}

module.exports.getNodes = (req, res) => {
    k8sApi.listNode().then((resp) => {
        res.send(resp.body.items);

    }).catch((err) => { console.log(err); res.status(500).send({ "err_code": err.errno }) })
}

module.exports.getNamespaces = (req, res) => {
    k8sApi.listNamespace().then(async (resp) => {
        var namespaces = resp.body.items;
        var count = 0;
        await new Promise((resolve, reject) => {
            namespaces.forEach(async (item) => {
                var pods = await k8sApi.listNamespacedPod(item.metadata.name);
                var deployments = await k8sApiBeta.listNamespacedDeployment(item.metadata.name);
                var services = await k8sApi.listNamespacedService(item.metadata.name);
                item.quant_pods = pods.body.items.length;
                item.quant_deployments = deployments.body.items.length;
                item.quant_services = services.body.items.length;
                count++;
                if (count == namespaces.length)
                    resolve();
            })
        })
        res.send(namespaces);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}
module.exports.getPods = (req, res) => {
    k8sApi.listPodForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}
module.exports.getDeployments = (req, res) => {
    k8sApiBeta.listDeploymentForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}
module.exports.getServices = (req, res) => {
    k8sApi.listServiceForAllNamespaces().then((resp) => {
        res.send(resp.body.items);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}

module.exports.createNamespace = (req, res) => {
    var data = req.body;
    k8sApi.createNamespace({
        metadata: {
            name: data.name
        }
    })
        .then((resp) => res.send(resp.body))
        .catch((err) => {
            res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message })
        })
}

module.exports.deleteDeployment = (req, res) => {
    //console.log(req.params)
    k8sApiBeta.deleteNamespacedDeployment(req.params.name, req.params.namespace).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}

module.exports.deleteNamespace = (req, res) => {
    //console.log(req.params.namespace)
    k8sApi.deleteNamespace(req.params.namespace).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}


module.exports.deleteNode = (req, res) => {
    console.log(req.params)
    k8sApi.deleteNode(req.params.name).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}