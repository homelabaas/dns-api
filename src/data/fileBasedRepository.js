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

  async loadFromObject(loadObject) {
    this.data = loadObject;
  }

  async saveToFile(filename) {
    const fileWriteContents = JSON.stringify(this.data);
    await fs.writeFile(filename, fileWriteContents);
  }

  hello() {
    console.log('hello');
  }
}