const fs = require('fs').promises;
const fssync = require('fs');

module.exports = class FileBasedRepository {

  constructor(opts) {
    this._data = {};
    this.initialised = false;
    this.filename = opts.fileRespositoryFilePath;
  };

  loadFullConfig(loadObject) {
    this._data = loadObject;
  };
  
  async initialise() {
    const dnsFileExists = await fssync.existsSync(this.filename);
    if (dnsFileExists) {
      console.log('Loading DNS data from ' + this.filename);
      await this.loadFromFile(this.filename);
    } else {
      console.log('Data file ' + this.filename + ' not found.');
      console.log('Initialising new DNS data.');
      this._data = {
        dns1: '192.168.0.1',
        dns2: '192.168.0.2',
        zones: {}
      };
    }
  }

  async setConfig(config) {
    this._data.dns1 = config.dns1;
    this._data.dns2 = config.dns2;
    await this.save();
  }

  async addZone(zoneId, zoneToAdd) {
    if (!(zoneToAdd.records)) {
      zoneToAdd.records = [];
    }
    if (this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneId + " already exist.");
    }
    this._data.zones[zoneId] = zoneToAdd;
    await this.save();
  }

  async removeZone(zoneId) {
    if (this._data.zones.hasOwnProperty(zoneId)) {
      delete this._data.zones[zoneId];
    } else {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    await this.save();
  }

  async addRecord(zoneId, record) {
    if (!this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneName + " does not exist.");
    }
    this._data.zones[zoneId].records.push(record);
    await this.save();
  }

  removeRecordByFqdn(zoneId, fqdn) {
    if (!this._data.zones[zoneId]) {
      throw new Error("Zone not found.");
    }
    const zone = this._data.zones[zoneId];
    const records = zone.records.filter(p => p.fqdn === fqdn);
    if (records.length === 1) {
      const record = records[0];
      for (let i = 0; i < zone.records.length; i++) {
        if (zone.records[i] === record) {
          zone.records.splice(i, 1);
        }
      }
    } else {
      throw new Error("Record not found by fqdn: " + fqdn);
    }
  }

  async save() {
    await this.saveToFile(this.filename);
  }

  async loadFromFile(fileToLoad) {
    const fileContents = await fs.readFile(fileToLoad);
    this._data = JSON.parse(fileContents.toString());
  }

  async saveToFile(filename) {
    const fileWriteContents = JSON.stringify(this._data);
    await fs.writeFile(filename, fileWriteContents);
  }

  getFullConfig() {
    console.log('Returning data');
    console.log(JSON.stringify(this._data));
    return this._data;
  }

  getZone(zoneId) {
    const returnZone = Object.assign({}, this._data.zones[zoneId]);
    delete returnZone.records;
    return returnZone;
  }

  getZoneRecords(zoneId) {
    return this._data.zones[zoneId].records;
  }

  getZoneRecord(zoneId, fqdn) {
    return this._data.zones[zoneId].records.find(p => p.fqdn === fqdn);
  }


  getConfig() {
    return {
      dns1: this._data.dns1,
      dns2: this._data.dns2
    }
  }
}