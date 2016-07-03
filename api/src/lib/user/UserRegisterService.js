module.exports = UserRegisterService;

function UserRegisterService(UserRepository, ProfileFactory) {
    this.repository = UserRepository;
    this.profileFactory = ProfileFactory;
}

UserRegisterService.prototype.validate = function (data) {
    if (!data.username) {
        return ["No username"];
    }
    return null;
};

UserRegisterService.prototype.register = function (userData) {
    var errors = this.validate(userData);
    var repository;
    if (errors) {
        return Promise.reject(errors);
    }

    repository = this.repository;
    return this.profileFactory.factory(userData.username).then(function (User) {
        return repository.add(User);
    });
};

