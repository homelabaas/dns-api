const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const mainConfigTemplateFilename = path.join(__dirname,'mainConfig.mustache')
const zoneConfigTemplateFilename = path.join(__dirname,'zoneConfig.mustache')
const mainConfigTemplate = fs.readFileSync(mainConfigTemplateFilename).toString();
const zoneConfigTemplate = fs.readFileSync(zoneConfigTemplateFilename).toString();
mustache.parse(zoneConfigTemplate);
mustache.parse(mainConfigTemplate);

class TemplateGenerator {
    // const mainConfigFilename = '/etc/bind/named.conf';
    generateConfigs(dataModel, mainConfigFilename, zonePath) {
        fs.writeFileSync(mainConfigFilename, this.generateMainConfig(dataModel));
        for (let i = 0; i < dataModel.zones.length; i++) {
            const zone = dataModel.zones[i];
            const zoneFilePath = path.join(zonePath, zone.filename); // '/etc/bind/zones/'
            fs.writeFileSync(zoneFilePath, this.generateZoneConfig(dataModel, i));
        }
    };

    generateMainConfig(dataModel) {
        return mustache.render(mainConfigTemplate, dataModel);
    }

    generateZoneConfig(dataModel, zoneIndex) {
        return mustache.render(zoneConfigTemplate, dataModel.zones[zoneIndex]);
    }
}

module.exports = TemplateGenerator;