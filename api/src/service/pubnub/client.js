var PUBNUB = require("pubnub");
var config = require("../../config");

module.exports = PUBNUB.init({
    publish_key: config.pubnub.publish_key,
    subscribe_key: config.pubnub.subscribe_key
});
