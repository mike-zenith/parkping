var TPClient = require("../../lib/targetprocess/TPClient");
var config = require("../../config");

module.exports = new TPClient(config.targetprocess.credentials);
