var app = require("../../api.index");
var request = require("supertest");
var assert = require("assert");
var userRepository = require("../../service/repository/userRepository");
var util = require("../util");

describe("Routes.User", function () {

    describe("/user .post", function () {
        it("should register user and user object", function (done) {
            var expectedUser = {
                "wallet": 0,
                "username": "Zenith",
                "karma": 0,
                "avatars": {}
            };

            request(app).post("/user")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({ "username": "Zenith" })
                .expect(function (res) {
                    delete res.body.id;
                    assert.deepEqual(expectedUser, res.body);
                })
                .expect(200, done);
        });

        it("should throw error when already exists");
        it("should throw error when not valid");
    });

    describe("/user .get", function () {
        beforeEach(function (done) {
            util.clearDb().then(function () {
                return userRepository.add(util.data.DefaultUser);
            }).then(function () {
                done();
            }).catch(done);
        });

        it("should return user by id", function (done) {
            var expectedUser = {
                "wallet": 0,
                "username": "YeyIamAUser",
                "karma": 200,
                "avatars": {}
            };

            request(app).get("/user/" + util.data.DefaultUser.id)
                .set("Accept", "application/json")
                .expect(function (res) {
                    delete res.body.id;
                    assert.deepEqual(expectedUser, res.body);
                })
                .expect(200, done)
        });
    });
});
