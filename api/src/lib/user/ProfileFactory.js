var Promise = require("bluebird");

module.exports = ProfileFactory;


function ProfileFactory() {
}

ProfileFactory.prototype.factory = function (username) {
    return Promise.resolve({
        avatars: {},
        wallet: 0,
        karma: 0,
        username: username
    });
};
