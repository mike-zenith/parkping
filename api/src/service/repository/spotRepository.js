var Repository = require("../../lib/repository/SpotMySQLRepository");
var db = require("../database/mysql");

module.exports = new Repository(db);
