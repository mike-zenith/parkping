var Promise = require("bluebird");

module.exports = SpotMySQLRepository;

var DEFAULT_FIND_RADIUS = 4;

function mapSpotsData(result) {
    return result.map(mapSpotData);
}

function mapSpotData(row) {
    if (row.distance) {
        delete row.distance;
    }
    row.pictures = row.pictures ? JSON.parse(row.pictures) : {};
    row.location = {
        type: "gps",
        long: row.long,
        lat: row.lat
    };
    delete row.long;
    delete row.lat;
    return row;
}

function mapSpotsAndSchedulesData(result) {
    var hydratedSpots = {};
    result.forEach(function (row) {
        if (row.schedule_id && row.schedule_startDate, row.schedule_endDate) {
            var schedule = {
                id: schedule_id,
                startDate: row.schedule_startDate,
                endDate: row.schedule_endDate
            };
        }

        if (!hydratedSpots[row.id]) {
            hydratedSpots[row.id] = mapSpotData(row);
        }

        hydratedSpots.schedule = hydratedSpots.schedule || [];
        if (schedule) {
            hydratedSpots.schedule.push(schedule);
        }
    });
    return hydratedSpots;
}

function SpotMySQLRepository(connection) {
    this.connection = connection;
}

SpotMySQLRepository.prototype.addUnapproved = function (User, Spot) {
    return this.connection.query(
        "INSERT INTO spot SET " +
        "user_id = ?, name = ?, approved = 0, rating = 0, pictures = ?, `long` = ?, lat = ?, location_type = ?"
        ,[
            User.id,
            Spot.name,
            Spot.pictures ? JSON.stringify(Spot.pictures) : "{}",
            Spot.location.long,
            Spot.location.lat,
            Spot.location.type
        ]
    ).then(function (result) {
        Spot.id = result.insertId;
        return Spot;
    });
};

SpotMySQLRepository.prototype.setToApproved = function (spotId) {
   return this.connection.query(
       "UPDATE spot SET approved = 1 WHERE id = ?",
       [spotId]
   );
};

SpotMySQLRepository.prototype.getAll = function () {
    return this.connection.query("SELECT * FROM spot")
        .then(mapSpotsData);
};

SpotMySQLRepository.prototype.getByDates = function (startDate, endDate) {
    var qry = "SELECT * FROM spot WHERE 1";
    var params = [];
    if (startDate) {
        qry +=  " AND startDate <= ?";
        params.push(startDate);
    }
    if (endDate) {
        qry += " AND endDate >= ?";
        params.push(endDate);
    }

    return this.connection.query(qry, params).then(mapSpotsData);
};

SpotMySQLRepository.prototype.getScheduleBySpotIdAndStartDate = function (spotId, startDate) {
    return this.connection.query(
        "SELECT p.*,s.id as schedule_id, s.startDate as schedule_start, s.endDate as schedule_end FROM spot as p " +
        "INNER JOIN spot_schedule as s ON s.spot_id = p.id " +
        "WHERE p.id = ? AND s.startDate >= startDate"
    ).then(mapSpotsAndSchedulesData);
};

SpotMySQLRepository.prototype.findByFilters = function (Filters) {
    var long = Filters.long;
    var lat = Filters.lat;
    var radius = Filters.radius || DEFAULT_FIND_RADIUS;
    var startDate = Filters.startDate || null;
    var endDate = Filters.endDate || null;
    var freeOnly = Filters.freeOnly || false;

    if (typeof long === "undefined" || typeof lat === "undefined" || lat === null || long === null) {
        if (!startDate && !endDate) {
            return this.getAll();
        }
        return this.getByDates(startDate, endDate);
    }

    var qry = "SELECT s.*, " +
        "( 6371 * acos( cos( radians(?) ) * cos( radians( s.lat ) ) * cos( radians( s.`long` ) - radians(?) ) + sin( radians(?) ) * sin( radians( s.lat ) ) ) ) AS distance ";

    var params =  [lat, long, lat];

    if (!freeOnly) {
        qry += " FROM spot as s WHERE 1";
    } else {
        startDate = startDate || new Date();
        qry += ", b.id FROM spot as s " +
            "LEFT JOIN bookings as b ON (b.spot_id = spot.id) WHERE b.startDate <= ? AND b.endDate "
    }

    if (startDate) {
        qry +=  " AND s.startDate <= ?";
        params.push(startDate);
    }
    if (endDate) {
        qry += " AND s.endDate >= ?";
        params.push(endDate);
    }

    qry +=" HAVING distance < ?";
    params.push(radius);

    return this.connection.query(qry, params).then(mapSpotsData);
};

