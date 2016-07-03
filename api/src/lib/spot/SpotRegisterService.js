module.exports = SpotRegisterService;

function SpotRegisterService(spotRepository, userProvider, spotFactory, tpSpotNotifier, pubNubNotifier) {
    this.repository = spotRepository;
    this.userProvider = userProvider;
    this.spotFactory = spotFactory;
    this.tpSpotNotifier = tpSpotNotifier;
    this.pubNubNotifier = pubNubNotifier;
}

SpotRegisterService.prototype.validate = function (spotData) {
    var e = [];
    if (!spotData) {
        return ["No data"];
    }

    if (!spotData || !spotData.location || !spotData.location.type) {
        e.push("No location")
    }
    if (!spotData.name) {
        e.push("No name");
    }

    return e.length ? e: null;
};

SpotRegisterService.prototype.addUnapproved = function (userId, spotData) {
    var errors = this.validate(spotData);
    var tpSpotNotifier = this.tpSpotNotifier;
    var pubNubNotifier = this.pubNubNotifier;
    var repository;
    if (errors) {
        return Promise.reject(errors);
    }

    repository = this.repository;
    return Promise.all([
        this.userProvider.getById(userId),
        this.spotFactory.factory(spotData.name, spotData.location)
    ]).then(function (promiseData) {
        var User = promiseData[0];
        var Spot = promiseData[1];

        tpSpotNotifier.notify(User, Spot).catch(function (e) {});
        pubNubNotifier.notifyApproved(User, Spot);

        return repository.addUnapproved(User, Spot);
    });
};
