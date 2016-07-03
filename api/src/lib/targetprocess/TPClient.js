var Promise = require("bluebird");
var request = require("superagent");

module.exports = TPClient;

function TPClient(tpCredentials) {
    var version = tpCredentials.version || 1;
    var domain = tpCredentials.domain;
    var protocol = tpCredentials.protocol || 'https';

    this.token = tpCredentials.token;
    this.urlRoot = protocol + '://'+domain+'/api/v'+version
}

TPClient.prototype.getConnection = function () {
    request
        .post(this.urlRoot + "/")
        .set("Authorization", "Basic " + this.token)
};

TPClient.prototype.createUserStory = function (name, description, Project) {
    var token = this.token;
    var url = this.urlRoot + "/UserStories?resultFormat=json";
    return new Promise(function (resolve, reject) {
        request
            .post(url)
            .set("Authorization", "Basic " + token)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({
                Name: name,
                Description: description,
                Project: Project
            })
            .end(function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
    });
}
;
