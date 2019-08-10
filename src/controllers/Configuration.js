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

module.exports.setConfig = function setConfig (req, res, next) {

  // Get config from the configuration service
  const service = container.resolve('configurationService');

  var body = req.swagger.params['body'].value;
  service.setConfig(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};