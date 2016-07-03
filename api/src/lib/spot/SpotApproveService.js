module.exports = SpotApproveService;

function SpotApproveService(spotRepository) {
    this.repository = spotRepository;
}

SpotApproveService.prototype.approveById = function (spotId) {
    return this.repository.setToApproved(spotId);
};
