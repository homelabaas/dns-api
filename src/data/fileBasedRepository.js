const fs = require('fs').promises;

module.exports = class FileBasedRepository {
  constructor() {
    this.data = {};
    this.initialised = false;
  }

  async loadFromFile(filename) {
    const fileContents = await fs.readFile(filename);
    this.data = JSON.parse(fileContents.toString());
  }

  loadFromObject(loadObject) {
    this.data = loadObject;
  }

  async saveToFile(filename) {
    const fileWriteContents = JSON.stringify(this.data);
    await fs.writeFile(filename, fileWriteContents);
  }

  getFullConfig() {
    return {
      dns1: '192.168.0.1',
      dns2: '192.168.0.2',
      zones: [
          {
              name: 'test.com',
              filename: 'db.test.com',
              TTL: 3600,
              serial: 1,
              primarymaster: 'ns.test.com.',
              adminEmail: 'admin.test.com.',
              records: [
                  {
                      fqdn: 'test',
                      type: 'A',
                      address: '192.168.0.1'
                  },
                  {
                    fqdn: 'ns',
                    type: 'A',
                    address: '192.168.0.1'
                  }
              ]
          },
          {
              name: 'test2.com',
              filename: 'db.test2.com',
              TTL: 3600,
              serial: 1,
              primarymaster: 'ns.test2.com.',
              adminEmail: 'admin.test2.com.',
              records: [
                  {
                      fqdn: 'test',
                      type: 'A',
                      address: '192.168.0.2'
                  },
                  {
                    fqdn: 'ns',
                    type: 'A',
                    address: '192.168.0.1'
                  }
              ]
          }
      ]
    }
  }

  hello() {
    console.log('hello');
  }
}