
module.exports = class RecordService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getRecordsByZoneId(zoneId) {
    return this.repository.getRecords(zoneId);
  }

  async addRecordForZoneId(zoneId, record) {
    this.repository.addRecord(zoneId, record);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Record added OK."};
  }
  // async addZone(zone) {
  //   const addZone = new Zone(zone.name, zone.TTL, zone.adminEmail, zone.nsaddress);
  //   await this.repository.addZone(zone.name, addZone);
  //   await this.bindConfigurationManager.reconfigureBind();
  //   return { 'message': "Zone added OK."};
  // }

  // async setZone(zone) {
  //   const setZone = new Zone(zone.name, zone.TTL, zone.adminEmail);
  //   await this.repository.setZone(zone.name, setZone);
  //   await this.bindConfigurationManager.reconfigureBind();
  //   return { 'message': "Zone set OK."};
  // }
}