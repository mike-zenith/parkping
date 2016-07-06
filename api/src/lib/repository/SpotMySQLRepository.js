var Promise = require("bluebird");

module.exports = SpotMySQLRepository;

var DEFAULT_FIND_RADIUS = 4;

function mapSpotsData(result) {
    return result.map(mapSpotData);
}

function mapSpotData(row) {
    return {
        user_id: row.user_id,
        name: row.name,
        approved: row.approved,
        id: row.id,
        location: {
            type: "gps",
            long: row.long,
            lat: row.lat
        },
        pictures: row.pictures ? JSON.parse(row.pictures) : {}
    };
}

function mapBookingData(row, prefix) {
    prefix = prefix || "booking_";
    return {
        id: row[prefix + "id"],
        startDate: row[prefix + "startDate"],
        endDate: row[prefix + "endDate"]
    };
}

function mapScheduleData(row, prefix) {
    prefix = prefix || "schedule_";
    return {
        id: row[prefix + "id"],
        startDate: row[prefix + "startDate"],
        endDate: row[prefix + "endDate"]
    };
}

function mapSpotsAndSchedulesData(result) {
    var hydratedSpots = {};
    result.forEach(function (row) {
        var booking;
        var schedule;
        if (row.schedule_id && row.schedule_startDate && row.schedule_endDate) {
            schedule = mapScheduleData(row, "schedule_");
        }
        if (row.booking_id) {
            booking = mapBookingData(row, "booking_");
        }

        if (!hydratedSpots[row.id]) {
            hydratedSpots[row.id] = mapSpotData(row);
        }

        hydratedSpots.schedule = hydratedSpots.schedule || {};
        hydratedSpots.booking = hydratedSpots.booking || {};

        if (schedule && !hydratedSpots.schedule[schedule.id]) {
            hydratedSpots.schedule[schedule.id] = schedule;
        }
        if (booking && !hydratedSpots.booking[booking.id]) {
            hydratedSpots.booking[booking.id] = booking;
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
        qry += ", sch.id as schedule_id, sch.startDate as schedule_startDate, sch.endDate as schedule_endDate" +
            " FROM spot as s LEFT JOIN spot_schedule as sch ON sch.spot_id = s.id WHERE 1";
    } else {
        startDate = startDate || (new Date()).valueOf();
        qry += ", sch.id as schedule_id, sch.startDate as schedule_startDate, sch.endDate as schedule_endDate";
        qry += ", b.id as booking_id, b.startDate as booking_startDate, b.endDate as booking_endDate FROM spot as s " +
            "LEFT JOIN bookings as b ON (b.spot_id = s.id) " +
            "LEFT JOIN spot_schedule as sch ON sch.spot_id = s.id " +
            "WHERE b.startDate <= ?";

        params.push(startDate);

        if (endDate) {
            qry += " AND b.endDate <= ?";
            params.push(endDate);
        }
    }

    if (startDate) {
        qry +=  " AND sch.startDate <= ?";
        params.push(startDate);
    }
    if (endDate) {
        qry += " AND sch.endDate >= ?";
        params.push(endDate);
    }

    qry +=" HAVING distance < ?";
    params.push(radius);

    console.log(qry, params);
    return this.connection.query(qry, params).then(mapSpotsData);
};

