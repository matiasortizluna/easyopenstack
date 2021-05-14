const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

module.exports.getPods = () => {
    k8sApi.listNamespacedService('default').then((res) => {
        console.log(res.body.items[1].spec.ports);
    })

    /*k8sApi.listNamespacedPod('default').then((res) => {
        console.log(res.body.items[0].status);
    })*/
}