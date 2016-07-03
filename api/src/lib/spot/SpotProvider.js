var Promise = require("bluebird");

module.exports = SpotProvider;

function SpotProvider(spotRepository) {
    this.repository = spotRepository;
}

SpotProvider.prototype.findByFilters = function (Filters) {
    return this.repository.findByFilters(Filters);
};
