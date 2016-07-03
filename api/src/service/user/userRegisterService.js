var UserRegister = require("../../lib/user/UserRegisterService");

var userRepository = require("../repository/userRepository");
var profileFactory = require("./profileFactory");

module.exports = new UserRegister(userRepository, profileFactory);
