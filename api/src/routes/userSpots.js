var router = require("../router");
var spotRegister = require("../service/spot/spotRegisterService");
var spotApproveService = require("../service/spot/spotApproveService");

router.post("/user/:userId/spot", function (req, res) {
    spotRegister.addUnapproved(req.params.userId, req.body)
        .then(function (Spot) {
            res.status(200).json(Spot);
        })
        .catch(function (e) {
            res.status(400).send(e);
        });

});


module.exports = router;
