var config = require("../../config");
var redis = require("redis");
var Promise = require("bluebird");

var client = redis.createClient(config.redis.port, config.redis.host);;

module.exports = Promise.promisifyAll(client);
