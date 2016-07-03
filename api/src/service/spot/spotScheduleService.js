var SpotScheduleService = require("../../lib/spot/SpotScheduleService");
var spotRepository = require("../repository/spotRepository");
var bookingRepository = require("../repository/bookingRepository");

module.exports = new SpotScheduleService(spotRepository, bookingRepository);
