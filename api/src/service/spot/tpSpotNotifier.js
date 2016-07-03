var TPSpotNotifier = require("../../lib/spot/TPSpotNotifier");
var config = require("../../config");
var tpClient = require("../targetprocess/tpClient");

module.exports = new TPSpotNotifier(
    tpClient,
    config.targetprocess.template.name,
    config.targetprocess.template.description,
    config.targetprocess.project,
    function (User, Spot) {
        return config.url.approve.replace(":userId", User.id).replace(":spotId", Spot.id);
    }
);
