var PubNubNotifier = require("../../lib/spot/PubNubNotifier");

var client = require("../pubnub/client");

module.exports = new PubNubNotifier(client);



