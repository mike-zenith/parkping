var Promise = require("bluebird");

const KEY_SPOTS_UNAPPROVED = "spots-unapproved";
const KEY_SPOTS_APPROVED = "spots";
const DEFAULT_FIND_RADIUS = 4000;
const KEY_SPOTS_GEO = "spots-geo";

module.exports = SpotRedisRepository;

function SpotRedisRepository(redisClient, userRepository) {
    this.redisClient = redisClient;
    this.userRepository = userRepository;
}

SpotRedisRepository.getExactFieldHash = function (userId, spotId) {
    return userId + ":" + spotId;
};

SpotRedisRepository.getIdFromFieldHash = function (field) {
    var tmp = field.split(":");
    return {
        userId: tmp[0],
        spotId: tmp[1]
    };
};

SpotRedisRepository.prototype.addUnapproved = function (User, Spot) {
    var spot = JSON.stringify(Spot);
    var fieldHash = SpotRedisRepository.getExactFieldHash(User.id, Spot.id);
    return this.redisClient.hsetAsync([KEY_SPOTS_UNAPPROVED, fieldHash, spot]);
};

SpotRedisRepository.prototype.getUnapproved = function (userId, spotId) {
    var fieldHash = SpotRedisRepository.getExactFieldHash(userId, spotId);
    return this.redisClient.hgetAsync([KEY_SPOTS_UNAPPROVED, fieldHash])
        .then(function (spotData) {
            var Spot = JSON.parse(spotData);
            Spot.approved = true;

            return Spot;
        });
};

SpotRedisRepository.prototype.removeUnapproved = function (userId, spotId) {
    var fieldHash = SpotRedisRepository.getExactFieldHash(userId, spotId);
    return this.redisClient.hdelAsync([KEY_SPOTS_UNAPPROVED, fieldHash]);
};

SpotRedisRepository.prototype.setToApproved = function (userId, spotId) {
    var that = this;
    return this.getUnapproved(userId, spotId)
        .then(function (Spot) {
            Spot.approved = true;
            Spot.rating = 0;
            that.removeUnapproved(userId, spotId);
            return that.addApproved(userId, Spot);
        })
};

SpotRedisRepository.prototype.addSpotGeodata = function (userId, spotId, long, lat) {
    return this.redisClient.geoaddAsync([
        KEY_SPOTS_GEO,
        long,
        lat,
        SpotRedisRepository.getExactFieldHash(userId, spotId)
    ]);
};

SpotRedisRepository.prototype.addApproved = function (userId, Spot) {
    var key = SpotRedisRepository.getExactFieldHash(userId, Spot.id);
    var spotData = JSON.stringify(Spot);
    var lat = Spot.location.lat;
    var long = Spot.location.long;
    return Promise.all([
        this.addSpotGeodata(userId, Spot.id, long, lat),
        this.redisClient.hmsetAsync([KEY_SPOTS_APPROVED, key, spotData])
    ]);
};

SpotRedisRepository.prototype.getApprovedById = function (userId, spotId) {
    return this.redisClient.hmgetAsync([
        KEY_SPOTS_APPROVED,
        SpotRedisRepository.getExactFieldHash(userId, spotId)
    ]).then(function (spotData) {
        return JSON.parse(spotData);
    })
};

SpotRedisRepository.prototype.findByFilters = function (Filters) {
    var long = Filters.long;
    var lat = Filters.lat;
    var radius = Filter.radius || DEFAULT_FIND_RADIUS;
    var startDate = Filter.startDate || null;
    var spotResolver = this.getApprovedById;

    this.redisClient.georadiusAsync([KEY_SPOTS_GEO, long, lat, radius, "m"])
        .then(function (data) {
            var i = 0;
            var resolveSpotPromises = [];
            var ids;
            if (!data) {
                return;
            }
            for(; i < data.length; i++) {
                ids = SpotRedisRepository.getIdFromFieldHash(data[i]);
                resolveSpotPromises.push(spotResolver(ids.userId, ids.spotId));
            }

            return Promise.all(resolveSpotPromises);
        })
        // filter by schedule
        /*
        .then(function (Spots) {
            var i = 0;
            var Spot;
            for(; i < Spots.length; i++) {
                Spot = Spots[i];
                if (Spot.schedule) {

                }
            }
        })
        */
        ;

};

