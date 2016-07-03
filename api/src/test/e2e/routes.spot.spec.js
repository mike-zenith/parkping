var app = require("../../api.index");
var request = require("supertest");
var assert = require("assert");
var spotRepository = require("../../service/repository/spotRepository");
var userRepository = require("../../service/repository/userRepository");
var util = require("../util");
var Promise = require("bluebird");

describe("Routes.Spot", function () {
    beforeEach(function (done) {
        util.clearDb().then(function () {
            return userRepository.add(util.data.DefaultUser)
        }).then(function () {
            var promises = [];
            for (var i = 0; i < util.data.UnapprovedSpots.length; i++) {
                promises.push(spotRepository.addUnapproved(
                    util.data.DefaultUser,
                    util.data.UnapprovedSpots[i]
                ));
            }
            return Promise.all(promises);
        })
        .then(function () {
            var promises = [];
            for (var i = 0; i < util.data.UnapprovedSpots.length; i++) {
                promises.push(spotRepository.setToApproved(
                    util.data.UnapprovedSpots[i].id
                ));
            }
            return Promise.all(promises);
        })
        .then(function () { done(); })
        .catch(done);
    });

    describe("/spot/:spotId/approve .post", function () {
        it("should approve a post", function (done) {
            request(app).post(
                    "/spot/" + util.data.UnapprovedSpots[0].id
                    + "/approve"
                )
                .send("")
                .expect(204, done);
        });
    });

    describe("/spot .get", function () {
        it("should return all spots without filter", function (done) {
            request(app).get("/spot")
                .expect(function (res) {
                    assert.equal(3, res.body.length);
                })
                .expect(200, done);
        });

        it("should filter spots based on location", function (done) {
            request(app).get("/spot?lat=52.506640&long=13.389199")
                .expect(function (res) {
                    assert.equal(3, res.body.length);
                })
                .expect(200, done);
        });
    });

});
