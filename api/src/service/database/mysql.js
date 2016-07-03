var mysql = require('promise-mysql');
var config = require("../../config");
var pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: 10
});

module.exports = pool;
