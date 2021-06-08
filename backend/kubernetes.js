const k8s = require('@kubernetes/client-node');
const fs = require('fs');
const yaml = require('js-yaml');

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

module.exports.deleteKubeconfig = (req, res) => {
    fs.unlink("./k8s_config", (err) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.send("")
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

module.exports.createPod = (req, res) => {
    console.log(req.body)
    console.log(req.files)
    var configFile = req.files.pod_configfile;
    if (configFile.name.split(".")[1] != "yml" && configFile.name.split(".")[1] != "yaml")
        return res.status(400).send({ "message": "It's not an YAML file!" });
    configFile.mv("podconfig.yml")
    fs.readFile("podconfig.yml", 'utf8', (err, data) => {
        if (err)
            return res.status(500).send({ "message": "Error while reading file. Try again." });
        var podConfig = yaml.load(data);
        console.log(podConfig)
        if (!podConfig.metadata.namespace)
            podConfig.metadata.namespace = "default"
        k8sApi.createNamespacedPod(podConfig.metadata.namespace, podConfig)
            .then((resp) => {
                fs.unlink("podconfig.yml", () => {
                    return
                });
                res.send(resp.body);
            })
            .catch((err) => {
                fs.unlink("podconfig.yml", () => {
                    return
                });
                res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message })
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


module.exports.deletePod = (req, res) => {
    console.log(req.params)
    k8sApi.deleteNamespacedPod(req.params.name, req.params.namespace).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}

module.exports.deleteService = (req, res) => {
    console.log(req.params)
    k8sApi.deleteNamespacedService(req.params.name, req.params.namespace).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                "message": err
            })
        });
}


module.exports.createService = (req, res) => {
    console.log(req.body)
    console.log(req.files)

    var configFile = req.files.service_configfile;
    if (configFile.name.split(".")[1] != "yml" && configFile.name.split(".")[1] != "yaml")
        return res.status(400).send({ "message": "It's not an YAML file!" });
    configFile.mv("serviceconfig.yml")
    fs.readFile("serviceconfig.yml", 'utf8', (err, data) => {
        if (err)
            return res.status(500).send({ "message": "Error while reading file. Try again." });
        var serviceConfig = yaml.load(data);
        console.log(serviceConfig)
        if (!serviceConfig.metadata.namespace)
            serviceConfig.metadata.namespace = "default"

        k8sApi.createNamespacedService(serviceConfig.metadata.namespace, serviceConfig)
            .then((resp) => {
                fs.unlink("serviceconfig.yml", () => {
                    return
                });
                res.send(resp.body);
            })
            .catch((err) => {
                fs.unlink("serviceconfig.yml", () => {
                    return
                });
                res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message })
            })
    });
}


module.exports.createDeployment = (req, res) => {
    var configFile = req.files.deployment_configfile;
    if (configFile.name.split(".")[1] != "yml" && configFile.name.split(".")[1] != "yaml")
        return res.status(400).send({ "message": "It's not an YAML file!" });
    configFile.mv("deploymentconfig.yml")
    fs.readFile("deploymentconfig.yml", 'utf8', (err, data) => {
        if (err)
            return res.status(500).send({ "message": "Error while reading file. Try again." });
        var deploymentconfig = yaml.load(data);
        if (!deploymentconfig.metadata.namespace)
            deploymentconfig.metadata.namespace = "default"

        k8sApiBeta.createNamespacedDeployment(deploymentconfig.metadata.namespace, deploymentconfig)
            .then((resp) => {
                fs.unlink("deploymentconfig.yml", () => {
                    return
                });
                res.send(resp.body);
            })
            .catch((err) => {
                fs.unlink("deploymentconfig.yml", () => {
                    return
                });
                res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message })
            })
    });
}

module.exports.updateDeployment = (req, res) => {
    let deployment = req.body.depoyment_to_update;
    console.log(deployment)
    const options = { "headers": { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_MERGE_PATCH}};
    k8sApiBeta.patchNamespacedDeployment(req.params.name, req.params.namespace, deployment, undefined, undefined, undefined, undefined, options).then((resp) => {
        res.send(resp.body);
    })
        .catch((err) => {
            console.log(err)
            res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message })
        })
}


module.exports.fastCreateDeployment = (req, res) => {
    let deployment = req.body.deployment;
    k8sApiBeta.createNamespacedDeployment(deployment.metadata.namespace, deployment)
        .then((resp) => {
            if (!req.body.service.create_service || !deployment.spec.template.spec.containers[0].ports)
                return res.send("");
            fastCreateService(res, deployment.metadata.labels.app, req.body.service, deployment.metadata.namespace);
        })
        .catch((err) => {
            res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message });
        })
}

function fastCreateService(res, label, serviceInfo, namespace) {
    let service = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: label + "-service"
        },
        spec: {
            selector: {
                app: label
            },
            ports: [
                {
                    protocol: serviceInfo.protocol,
                    port: parseInt(serviceInfo.service_port),
                    targetPort: parseInt(serviceInfo.port)
                }
            ],
            type: serviceInfo.service_type
        }
    }
    k8sApi.createNamespacedService(namespace, service)
        .then(() => res.send(""))
        .catch((err) => {
            res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message });
        })
}

module.exports.getGrafanaLink = (req, res) => {
    k8sApi.readNamespacedService('grafana', 'ingress-nginx')
    .then((resp) => {
        fs.readFile("k8s_config", 'utf8', (err, data) => {
            if (err)
                return res.status(500).send({ "message": "Error while reading file. Try again." });
            var k8sConfig = yaml.load(data);
            var server = k8sConfig.clusters[0].cluster.server;
            var serverIp = server.split("/")[2].split(":")[0];
            var grafanaIp = "http://"+serverIp+":"+resp.body.spec.ports[0].nodePort;
            res.send(grafanaIp);
        });
    })
    .catch((err) => res.status(err.response.request.response.body.code).send({ "message": err.response.request.response.body.message }))
    
}