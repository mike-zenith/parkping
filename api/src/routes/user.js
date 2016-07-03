var router = require("../router");
var userRegister = require("../service/user/userRegisterService");
var userProvider = require("../service/user/userProvider");

router.get("/user", function (req, res) {
    res.status(200).send();
});

router.post("/user", function (req, res) {
    userRegister.register(req.body)
        .then(function (user) {
            res.status(200).json(user);
        })
        .catch(function (e) {
            res.status(400).send(e);
        });
});

router.get("/user/:userId", function (req, res) {
    userProvider.getById(req.params.userId)
        .then(function (User) {
            res.status(200).json(User);
        })
        .catch(function (e) {
            res.status(400).send(e);
        });
});


module.exports = router;
