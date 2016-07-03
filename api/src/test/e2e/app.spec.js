var app = require("../../api.index");
var request = require("supertest");
var assert = require("assert");

describe("App", function () {

    describe("/: servers index page", function () {
        it("should respond 200 to /", function () {
            request(app).get("/").expect(200);
        });
    });

});
