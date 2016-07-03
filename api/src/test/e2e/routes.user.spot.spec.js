var app = require("../../api.index");
var request = require("supertest");
var assert = require("assert");
var userRepository = require("../../service/repository/userRepository");
var spotRepository = require("../../service/repository/spotRepository");
var util = require("../util");

describe("Routes.User.Spot", function () {
    beforeEach(function (done) {
        util.clearDb();
        userRepository.add(util.data.DefaultUser)
            .then(function () {
                done();
            }).catch(done);
    });

    describe("/user/:id/spot .post", function () {
       it("should store spot and return hash", function (done) {
           var expectedSpot = {
               "id": 1,
               "location": {
                   "type": "gps",
                   "lat": 52.506275,
                   "long": 13.393147
               },
               "name": "Pikachu",
               "rating": 0,
               "approved": false,
               "schedule": [],
               "pictures": {}
           };
           var sendableSpot = {
               "location": {
                   "type": "gps",
                   "lat": 52.506275,
                   "long": 13.393147
               },
               "name": "Pikachu"
           };

           request(app).post("/user/" + util.data.DefaultUser.id + "/spot")
               .set("Accept", "application/json")
               .set("Content-Type", "application/json")
               .send(sendableSpot)
               .expect(function (res) {
                   assert.deepEqual(expectedSpot, res.body);
               })
               .expect(200, done)
       });
    });
});
