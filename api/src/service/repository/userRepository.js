var Repository = require("../../lib/repository/UserMySQLRepository");
var db = require("../database/mysql");

module.exports = new Repository(db);
