module.exports = TPSpotNotifier;

function getHereMapsLocation(Spot) {
    return "https://maps.here.com/?x=ep&map="
        + Spot.location.lat + ","
        + Spot.location.long + ",10,normal";
}

function getApproveUrl(User, Spot) {
    return "http://"
}

function TPSpotNotifier(tpClient, name, description, TargetProject, approveUrlGenerator) {
    this.tpClient = tpClient;
    this.name = name;
    this.description = description;
    this.targetProject = TargetProject;
    this.approveUrlGenerator = approveUrlGenerator;
}

TPSpotNotifier.prototype.notify = function (User, Spot) {
    var name = this.name;

    var hereMapsUrl = getHereMapsLocation(Spot);
    var description = this.description
        .replace("{{mapurl}}", hereMapsUrl)
        .replace("{{username}}", User.username)
        .replace("{{approveurl}}", this.approveUrlGenerator(User, Spot))
    ;

    return this.tpClient.createUserStory(name, description, this.targetProject);
};
