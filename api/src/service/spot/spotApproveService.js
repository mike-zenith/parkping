var SpotApproveService = require("../../lib/spot/SpotApproveService");
var spotRepository = require("../repository/spotRepository");

module.exports = new SpotApproveService(spotRepository);
