const mustache = require('mustache');
const fs = require('fs').promises;
const path = require('path');
const config = require('config');

class TemplateGenerator {

    constructor() {
      this.mainConfigTemplate = null;
      this.zoneConfigTemplate = null;
    }

    async initialiseTemplates() {
      const mainConfigTemplateFilename = path.join(__dirname, '..', 'templates', config.get('Templates.Main'));
      const zoneConfigTemplateFilename = path.join(__dirname, '..', 'templates', config.get('Templates.Zone'));
      this.mainConfigTemplate = (await fs.readFile(mainConfigTemplateFilename)).toString();
      this.zoneConfigTemplate = (await fs.readFile(zoneConfigTemplateFilename)).toString();
      mustache.parse(this.zoneConfigTemplate);
      mustache.parse(this.mainConfigTemplate);
    }

    // const mainConfigFilename = '/etc/bind/named.conf';
     async generateConfigs(dataModel, mainConfigFilename, zonePath) {
        console.log('Writing main config file to ' + mainConfigFilename);
        await fs.writeFile(mainConfigFilename, this.generateMainConfig(dataModel));
        if (dataModel.zones) {
          for (let i = 0; i < dataModel.zones.length; i++) {
              const zone = dataModel.zones[i];
              const zoneFilePath = path.join(zonePath, zone.filename); // '/etc/bind/zones/'
              console.log('Writing zone ' + zone.name + ' config file to ' + zoneFilePath);
              await fs.writeFile(zoneFilePath, this.generateZoneConfig(dataModel, i));
          }
        }
    };

    generateMainConfig(dataModel) {
        return mustache.render(this.mainConfigTemplate, dataModel);
    }

    generateZoneConfig(dataModel, zoneIndex) {
        return mustache.render(this.zoneConfigTemplate, dataModel.zones[zoneIndex]);
    }
}

module.exports = TemplateGenerator;