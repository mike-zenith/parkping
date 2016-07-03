var router = require("../router");
var spotProvider = require("../service/spot/spotProvider");
var spotApproveService = require("../service/spot/spotApproveService");
var spotScheduleUpdateService = require("../service/spot/spotScheduleService");

router.get("/spot", function (req, res) {
    var Filters = {
        long: req.query.long,
        lat: req.query.lat,
        radius: req.query.radius,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        freeOnly: true
    };

    spotProvider.findByFilters(Filters)
        .then(function (Spots) {
            res.status(200).json(Spots);
        })
        .catch(function (e) {
            res.status(400).send(e);
        });
});

router.post("/spot/:spotId/approve", function (req, res) {
    spotApproveService.approveById(req.params.spotId)
        .then(function () {
            res.status(204).send("");
        })
        .catch(function (e) {
            res.status(400).send(e);
        });
});

router.post("/spot/status", function (req, res) {
    spotScheduleUpdateService.updateSchedule(res.body.spot_id, res.body.device_status);
});

module.exports = router;
