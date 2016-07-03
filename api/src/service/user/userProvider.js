var UserProvider = require("../../lib/user/UserProvider");
var userRepository = require("../repository/userRepository");

module.exports = new UserProvider(userRepository);
