var SpotProvider = require("../../lib/spot/SpotProvider");
var spotRepository = require("../repository/spotRepository");

module.exports = new SpotProvider(spotRepository);
