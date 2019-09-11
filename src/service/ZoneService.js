const Zone = require('../data/Zone');

module.exports = class ConfigurationService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getZone(zoneId) {
    return this.repository.getZone(zoneId);
  }

  getAllZones() {
    return this.repository.getZones();
  }

  async addZone(zone) {
    const addZone = new Zone(zone.name, zone.TTL, zone.adminEmail, zone.nsaddress);
    await this.repository.addZone(zone.name, addZone);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Zone added OK."};
  }

  async setZone(zone) {
    const setZone = new Zone(zone.name, zone.TTL, zone.adminEmail);
    await this.repository.setZone(zone.name, setZone);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Zone set OK."};
  }

  async deleteZone(zoneId) {
    await this.repository.deleteZone(zoneId);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Zone deleted OK."};
  }
}