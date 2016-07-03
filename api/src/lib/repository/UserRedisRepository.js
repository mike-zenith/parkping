var Promise = require("bluebird");

const KEY_USERS = "users";

module.exports = UserRedisRepository;

function UserRedisRepository(redisClient) {
    this.redisClient = redisClient;
}

UserRedisRepository.prototype.add = function (User) {
    var profile = JSON.stringify(User);

    return this.redisClient.hsetAsync([KEY_USERS, User.id, profile]);
};

UserRedisRepository.prototype.getById = function (uid) {
    return this.redisClient.hgetAsync([KEY_USERS, uid])
        .then(function (data) {
            if (!data) {
                throw new Error("Not found");
            }
            return JSON.parse(data);
        });
};
