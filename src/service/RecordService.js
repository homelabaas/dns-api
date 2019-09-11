
module.exports = class RecordService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getRecordsByZoneId(zoneId) {
    return this.repository.getRecords(zoneId);
  }

  async addRecordForZoneId(zoneId, record) {
    await this.repository.addRecord(zoneId, record);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Record added OK."};
  }

  async deleteRecordForZoneId(zoneId, record) {
    await this.repository.deleteRecord(zoneId, record);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "Record deleted OK."};
  }

}