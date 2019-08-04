const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getConfig = function getConfig (req, res, next) {

  // Get config from the configuration service
  const service = container.resolve('configurationService');

  try {
    const returnValue = service.getConfig();
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}
