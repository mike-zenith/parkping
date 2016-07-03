module.exports = PubNubNotifier;

const PUBNUB_CHANNEL_SPOT = "spot.change";

function PubNubNotifier(pubNubClient) {
    this.pubNubClient = pubNubClient;
}

PubNubNotifier.prototype.notifyApproved = function (User, Spot) {
    var message = {
        type: "approve",
        user: User,
        spot: Spot
    };

    this.pubNubClient.publish({
        channel: PUBNUB_CHANNEL_SPOT,
        message: JSON.stringify(message)
    });
};
