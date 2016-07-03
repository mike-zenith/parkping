var Promise = require("bluebird");

module.exports = Factory;

function Factory() {
}

Factory.prototype.factory = function (name, location) {
    return Promise.resolve({
        "location": location,
        "rating": 0,
        "approved": false,
        "name": name,
        "schedule": [],
        "pictures": {}
    });
};
