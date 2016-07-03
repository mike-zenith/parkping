module.exports = SpotScheduleService;

function SpotScheduleService(spotRepository, bookingsRepository) {
    this.spotRepository = spotRepository;
    this.bookingsRepository = bookingsRepository;
}

SpotScheduleService.STATUS_AVAILABLE = "available";
SpotScheduleService.STATUS_BOOKED = "booked";

SpotScheduleService.prototype.updateSchedule = function (spotId, deviceStatus) {
    var now = new Date();
    if (deviceStatus === SpotScheduleService.STATUS_AVAILABLE) {
        return this.markSpotScheduleAvailable(spotId, now);
    } else {
        return this.markSpotScheduleBooked(spotId, now)
    }
};

SpotScheduleService.prototype.markSpotScheduleBooked = function (spotId, startDate) {
    var booker = this.setupBooking;
    return Promise.all([
        this.hasSpotSchedule(spotId, startDate),
        this.getBooking(spotId, startDate)
    ]).then(function (data) {
        if (!data[0]) {
            throw new Error("No schedule available");
        }
        if (data[1]) {
            return true;
        }

        booker(spotId, startDate);
    });
};

SpotScheduleService.prototype.setupBooking = function (spotId, startDate) {
    return this.bookingsRepository.createBooking({ spotId: spotId, startDate: startDate, endDate: null });
};

SpotScheduleService.prototype.markSpotScheduleAvailable = function (spotId, startDate) {
    var booker = this.setBookingFinished;
    return Promise.all([
        this.hasSpotSchedule(spotId, startDate),
        this.getBooking(spotId, startDate)
    ]).then(function (data) {
        if (!data[0]) {
            throw new Error("No schedule available");
        }
        if (data[1]) {
            return booker(data[1], startDate);
        }
        return true;
    });
};

SpotScheduleService.prototype.setBookingFinished = function (booking, endDate) {
    return this.bookingsRepository.setBookingFinished(booking.id, endDate);
};

SpotScheduleService.prototype.getBooking = function (spotId, startDate) {
    return this.bookingsRepository.getBooking(spotId, startDate);
};

SpotScheduleService.prototype.hasSpotSchedule = function (spotId, startDate) {
    return this.spotRepository.getScheduleBySpotIdAndStartDate(spotId, startDate)
        .then(function (spot) {
            return spot.schedule.length;
        });
};

