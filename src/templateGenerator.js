const mustache = require('mustache');
const fs = require('fs').promises;
const path = require('path');

class TemplateGenerator {

    constructor() {
      this.mainConfigTemplate = null;
      this.zoneConfigTemplate = null;
    }

    async initialiseTemplates() {
      const mainConfigTemplateFilename = path.join(__dirname,'mainConfig.mustache')
      const zoneConfigTemplateFilename = path.join(__dirname,'zoneConfig.mustache')
      this.mainConfigTemplate = (await fs.readFile(mainConfigTemplateFilename)).toString();
      this.zoneConfigTemplate = (await fs.readFile(zoneConfigTemplateFilename)).toString();
      mustache.parse(this.zoneConfigTemplate);
      mustache.parse(this.mainConfigTemplate);
    }

    // const mainConfigFilename = '/etc/bind/named.conf';
     async generateConfigs(dataModel, mainConfigFilename, zonePath) {
        await fs.writeFile(mainConfigFilename, this.generateMainConfig(dataModel));
        for (let i = 0; i < dataModel.zones.length; i++) {
            const zone = dataModel.zones[i];
            const zoneFilePath = path.join(zonePath, zone.filename); // '/etc/bind/zones/'
            await fs.writeFile(zoneFilePath, this.generateZoneConfig(dataModel, i));
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