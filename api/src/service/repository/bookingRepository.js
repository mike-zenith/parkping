var Repository = require("../../lib/repository/BookingMySQLRepository");
var db = require("../database/mysql");

module.exports = new Repository(db);
