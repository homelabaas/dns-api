const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getConfig = async function getConfig (req, res, next) {
  const service = container.resolve('configurationService');
  try {
    const returnValue = service.getConfig();
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}

module.exports.setConfig = async function setConfig (req, res, next) {
  const service = container.resolve('configurationService');
  var body = req.swagger.params['body'].value;
  try {
    const returnValue = await service.setConfig(body);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
};