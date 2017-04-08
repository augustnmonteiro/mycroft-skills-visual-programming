module.exports = function (RED) {
    var ws = require("ws");

    function Say(config) {

        RED.nodes.createNode(this, config);
        var node = this;

        node.server = new ws("ws://127.0.0.1:8181/core");

        node.server.on("open", function () {

            node.on("input", function (message) {
                var utterance = message !== true ? message : config.phrases;
                node.server.send(JSON.stringify({
                    "type": "speak",
                    "data": {"expect_response": false, "utterance": utterance},
                    "context": null
                }));
            });
        });
    }

    RED.nodes.registerType("say", Say);
};