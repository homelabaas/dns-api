const fs = require('fs').promises;
const fssync = require('fs');
const config = require('config');

module.exports = class FileBasedRepository {

  constructor() {
    this._data = {};
    this.initialised = false;
    this.filename = config.get("Paths.DNSRepositoryFile");
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
      console.log('Initialising new DNS data.');
      this._data = {
        dns1: '192.168.0.1',
        dns2: '192.168.0.2',
        zones: [ ]
      };
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
    // return {
    //   dns1: '192.168.0.1',
    //   dns2: '192.168.0.2',
    //   zones: [
    //       {
    //           name: 'test.com',
    //           filename: 'db.test.com',
    //           TTL: 3600,
    //           serial: 1,
    //           primarymaster: 'ns.test.com.',
    //           adminEmail: 'admin.test.com.',
    //           records: [
    //               {
    //                   fqdn: 'test',
    //                   type: 'A',
    //                   address: '192.168.0.1'
    //               },
    //               {
    //                 fqdn: 'ns',
    //                 type: 'A',
    //                 address: '192.168.0.1'
    //               }
    //           ]
    //       },
    //       {
    //           name: 'test2.com',
    //           filename: 'db.test2.com',
    //           TTL: 3600,
    //           serial: 1,
    //           primarymaster: 'ns.test2.com.',
    //           adminEmail: 'admin.test2.com.',
    //           records: [
    //               {
    //                   fqdn: 'test',
    //                   type: 'A',
    //                   address: '192.168.0.2'
    //               },
    //               {
    //                 fqdn: 'ns',
    //                 type: 'A',
    //                 address: '192.168.0.1'
    //               }
    //           ]
    //       }
    //   ]
    // }
  }
}