const mustache = require('mustache');
const fs = require('fs').promises;
const path = require('path');
const config = require('config');

class TemplateGenerator {

  constructor() {
    this.mainConfigTemplate = null;
    this.zoneConfigTemplate = null;
  };

  async initialiseTemplates() {
    const mainConfigTemplateFilename = path.join(__dirname, '..', 'templates', config.get('Templates.Main'));
    const zoneConfigTemplateFilename = path.join(__dirname, '..', 'templates', config.get('Templates.Zone'));
    this.mainConfigTemplate = (await fs.readFile(mainConfigTemplateFilename)).toString();
    this.zoneConfigTemplate = (await fs.readFile(zoneConfigTemplateFilename)).toString();
    mustache.parse(this.zoneConfigTemplate);
    mustache.parse(this.mainConfigTemplate);
  };

  async generateConfigs(dataModel, mainConfigFilename, zonePath) {
    console.log('Writing main config file to ' + mainConfigFilename);
    var copiedObject =  Object.assign({}, dataModel); 
    if (copiedObject.zones) {
      copiedObject.zones = Object.values(copiedObject.zones);
    }
    await fs.writeFile(mainConfigFilename, this.generateMainConfig(copiedObject));
    if (dataModel.zones) {
      const zones = Object.values(dataModel.zones);
      for (let i = 0; i < zones.length; i++) {
          const zone = zones[i];
          const zoneFilePath = path.join(zonePath, zone.filename);
          console.log('Writing zone ' + zone.name + ' config file to ' + zoneFilePath);
          await fs.writeFile(zoneFilePath, this.generateZoneConfig(zone));
      }
    }
  };

  generateMainConfig(dataModel) {
      return mustache.render(this.mainConfigTemplate, dataModel);
  };

  generateZoneConfig(zone) {
      return mustache.render(this.zoneConfigTemplate, zone);
  };
}

module.exports = TemplateGenerator;