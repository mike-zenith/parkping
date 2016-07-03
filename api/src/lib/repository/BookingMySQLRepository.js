module.exports = BookingRepository;

function BookingRepository(connection) {
    this.connection = connection;
}

BookingRepository.prototype.getBooking = function (spotId, activeDate) {
    return this.connection.query("SELECT * FROM bookings WHERE " +
        "spot_id = ? AND ? BETWEEN startDate AND endDate OR startDate <= activeDate AND endDate IS NULL",
        [spotId, activeDate]
    ).then(function (rows) {
        if (rows.length) {
            return rows[0];
        }
        return {};
    });
};

BookingRepository.prototype.setBookingFinished = function (bookingsId, endDate) {
    return this.connection.query(
        "UPDATE bookings SET endDate = ? WHERE id = ?",
        [endDate, bookingsId]
    );
};

BookingRepository.prototype.createBooking = function (booking) {
    return this.connection.query(
        "INSERT INTO bookings SET spot_id = ?, startDate = ?",
        [booking.spotId, booking.startDate]
    ).then(function (result) {
        booking.id = result.insertId;
        return booking;
    });
};
