const fs = require('fs').promises;
const path = require('path');

module.exports = class FileBasedRepository {
  constructor() {
    this.data = {};
    this.initialised = false;
  }

  loadFromFile = async (filename) => {
    const fileContents = await fs.readFile(filename);
    this.data = JSON.parse(fileContents.toString());
  }

  loadFromObject = async (loadObject) => {
    this.data = loadObject;
  }

  saveToFile = async (filename) => {
    const fileWriteContents = JSON.stringify(this.data);
    await fs.writeFile(filename, fileWriteContents);
  }
}