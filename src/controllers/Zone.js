const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getZone = function getConfig (req, res, next) {
  const service = container.resolve('zoneService');
  var zoneId = req.swagger.params['id'].value;
  try {
    const returnValue = service.getZone(zoneId);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}

module.exports.setZone = function setConfig (req, res, next) {
  const service = container.resolve('zoneService');
  var zoneId = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  service.setZone(zoneId, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};