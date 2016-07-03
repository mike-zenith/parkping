var mysql = require("../service/database/mysql");
var config = require("../config");
var promise = require("bluebird");

module.exports = {
    data: {
        UnapprovedSpots: [
            {
                "id": 2,
                "location": {
                    "type": "gps",
                    "lat": 52.506869,
                    "long": 13.393093
                },
                "name": "Charizard",
                "rating": null,
                "approved": false,
                "schedule": [],
                "pictures": {}
            },
            {
                "id": 3,
                "location": {
                    "type": "gps",
                    "lat": 52.506275,
                    "long": 13.393147
                },
                "name": "Pikachu",
                "rating": null,
                "approved": false,
                "schedule": [],
                "pictures": {}
            },
            {
                "id": 4,
                "location": {
                    "type": "gps",
                    "lat": 52.506640,
                    "long": 13.389199
                },
                "name": "Charizard",
                "rating": null,
                "approved": false,
                "schedule": [],
                "pictures": {}
            }
        ],
        DefaultSpot: {
            "id": 2,
            "location": {
                "type": "gps",
                "lat": 52.506275,
                "long": 13.393147
            },
            "name": "Pikachu",
            "rating": null,
            "approved": false,
            "schedule": [],
            "pictures": {}
        },
        DefaultUser: {
            "id": 1,
            "username": "YeyIamAUser",
            "wallet": 0,
            "karma": 200,
            "avatars": {}
        }
    },
    clearDb: function () {
        var tables = ["user", "spot", "spot_schedule"];
        var promises = [];
        tables.forEach(function (table) {
           promises.push(mysql.query("TRUNCATE " + table));
        });

        return Promise.all(promises);
    }
};
