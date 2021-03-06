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
      process.stdout.write('Loading DNS data from ' + this.filename + '\n');
      await this.loadFromFile(this.filename);
    } else {
      process.stdout.write('Data file ' + this.filename + ' not found.\n');
      process.stdout.write('Initialising new DNS data.\n');
      this._data = {
        dnsforwarders: ['192.168.0.1'],
        zones: {}
      };
      await this.save();
    }
  }

  async setConfig(forwarders) {
    this._data.dnsforwarders = forwarders;
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

  async deleteZone(zoneId) {
    if (!this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    delete(this._data.zones[zoneId]);
    await this.save();
  }

  async setZone(zoneId, zoneToSet) {
    if (this._data.zones.hasOwnProperty(zoneId)) {
      this._data.zones[zoneId].name = zoneToSet.name;
      this._data.zones[zoneId].filename = zoneToSet.filename;
      this._data.zones[zoneId].TTL = zoneToSet.TTL;
      this._data.zones[zoneId].serial = zoneToSet.serial;
      this._data.zones[zoneId].primarymaster = zoneToSet.primarymaster;
      this._data.zones[zoneId].adminEmail = zoneToSet.adminEmail;
    } else {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
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
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    const zone = this._data.zones[zoneId];
    const recordIndex = zone.records.findIndex(p => p.name === record.name &&
      p.type === record.type && p.address === record.address);
    if (recordIndex === -1) {
      zone.records.push(record);
      await this.save();
    } else {
      throw new Error("Record " + record.name + " already exists.");
    }
  }

  async deleteRecord(zoneId, record) {
    if (!this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    const zone = this._data.zones[zoneId];
    const recordIndex = zone.records.findIndex(p => p.name === record.name &&
      p.type === record.type && p.address === record.address);
    if (recordIndex >= 0) {
      zone.records.splice(recordIndex, 1);
      await this.save();
    } else {
      throw new Error("Record " + JSON.stringify(record) + " doesn't exist.");
    }
  }

  removeRecordByName(zoneId, name) {
    if (!this._data.zones[zoneId]) {
      throw new Error("Zone not found.");
    }
    const zone = this._data.zones[zoneId];
    const records = zone.records.filter(p => p.name === name);
    if (records.length === 1) {
      const record = records[0];
      for (let i = 0; i < zone.records.length; i++) {
        if (zone.records[i] === record) {
          zone.records.splice(i, 1);
        }
      }
    } else {
      throw new Error("Record not found by name: " + name);
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
    return this._data;
  }

  getZone(zoneId) {
    if (!this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    const returnZone = Object.assign({}, this._data.zones[zoneId]);
    if (returnZone.records)
      delete returnZone.records;
    return returnZone;
  }

  getRecords(zoneId) {
    if (!this._data.zones.hasOwnProperty(zoneId)) {
      throw new Error("Zone " + zoneId + " does not exist.");
    }
    if (this._data.zones[zoneId].records)
      return this._data.zones[zoneId].records;
    else
      return [];
  }

  getZones() {
    const zoneArray = Object.values(this._data.zones);
    return zoneArray.map(p => {
      return {
        name: p.name,
        filename: p.filename,
        TTL: p.TTL,
        serial: p.serial,
        primarymaster: p.primarymaster,
        adminEmail: p.adminEmail
      }
    });
  }

  getZoneRecords(zoneId) {
    return this._data.zones[zoneId].records;
  }

  getZoneRecord(zoneId, name) {
    return this._data.zones[zoneId].records.find(p => p.name === name);
  }

  getConfig() {
    return {
      dnsforwarders: this._data.dnsforwarders
    }
  }
}