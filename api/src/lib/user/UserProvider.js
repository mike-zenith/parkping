module.exports = UserProvider;

function UserProvider(userRepository) {
    this.userRepository = userRepository;
}

UserProvider.prototype.getById = function (id) {
    return this.userRepository.getById(id);
};
