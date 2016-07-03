var Promise = require("bluebird");

const KEY_USERS = "users";

module.exports = UserMySQLRepository;

function UserMySQLRepository(connection) {
    this.connection = connection;
}

UserMySQLRepository.prototype.add = function (User) {
    return this.connection.query(
        "INSERT INTO user "
        + "SET username = ?, karma = ?, avatars = ?, wallet = ?",
        [
            User.username,
            User.karma || 0,
            User.avatars ? JSON.stringify(User.avatars) : "",
            User.wallet || 0
        ]
    ).then(function (result) {
        User.id = result.insertId;
        return User;
    });
};

UserMySQLRepository.prototype.getById = function (uid) {
    return this.connection.query("SELECT * FROM user WHERE id = ?", [uid])
        .then(function (rows) {
            if (!rows) {
                throw new Error("User not found");
            }
            var User = rows[0];
            User.avatars = User.avatars ? JSON.parse(User.avatars) : {};
            return User;
        });
};
