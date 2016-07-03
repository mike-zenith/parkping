var SpotRegister = require("../../lib/spot/SpotRegisterService");

var spotRepository = require("../repository/spotRepository");
var spotFactory = require("./spotFactory");
var userProvider = require("../user/userProvider");
var tpSpotNotifier = require("./tpSpotNotifier");
var pubNubNotifier = require("./pubNubNotifier");

module.exports = new SpotRegister(spotRepository, userProvider, spotFactory, tpSpotNotifier, pubNubNotifier);
