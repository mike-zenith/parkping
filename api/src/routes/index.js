var router = require("../router");

router.get("/", function (req, res) {
    res.status(200).send("OK");
});

module.exports = router;
