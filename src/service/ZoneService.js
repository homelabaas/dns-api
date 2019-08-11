module.exports = class ConfigurationService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getZone(zoneId) {
    return this.repository.getZone(zoneId);
  }

  async addZone(zoneId, zone) {
    await this.repository.addZone(zoneId, zone);
    await this.bindConfigurationManager.reconfigureBind();
  }
}