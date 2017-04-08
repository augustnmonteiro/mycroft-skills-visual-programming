module.exports = function (RED) {
    var ws = require("ws");

    function Heard(config) {

        RED.nodes.createNode(this, config);
        var node = this;
        var phrasesName = "NodeRedPhrases" + (+new Date() + (Math.floor(Math.random() * 1000) + 1));
        var intentName = "NodeRedIntent" + (+new Date() + (Math.floor(Math.random() * 1000) + 1));
        var payload = true;

        node.on("input", function (message) {
            if (message && message.payload) {
                payload = message.payload;
            } else {
                payload = true;
            }
        });

        node.server = new ws("ws://127.0.0.1:8181/core");

        node.server.on("open", function () {
            node.server.send(JSON.stringify({
                "type": "register_vocab",
                "data": {"start": config.phrases.replace(/\n/g, "|"), "end": phrasesName},
                "context": null
            }));
            node.server.send(JSON.stringify({
                "type": "register_intent",
                "data": {
                    "at_least_one": [],
                    "requires": [[phrasesName, phrasesName]],
                    "optional": [],
                    "name": intentName
                },
                "context": null
            }));
            node.server.on("message", function (message) {
                try {
                    var msg = JSON.parse(message);
                    if (msg && msg.data && msg.data.intent_type == intentName) {
                        node.send(payload);
                    }
                } catch (e) {}
            });
        });
    }

    RED.nodes.registerType("heard", Heard);
};