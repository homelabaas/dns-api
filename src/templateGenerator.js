const mustache = require('mustache');

const generateConfigs = (dataModel) => {
    const mainConfigTemplate = mustache.parse('mainConfig.mustache');
    const zoneConfig = mustache.parse('zoneConfig.mustache');
    //
}