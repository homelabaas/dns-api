const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getZone = function getZone (req, res, next) {
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

module.exports.getAllZones = function getAllZones (req, res, next) {
  const service = container.resolve('zoneService');
  try {
    const returnValue = service.getAllZones();
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}

module.exports.setZone = function setZone (req, res, next) {
  const service = container.resolve('zoneService');
  var body = req.swagger.params['body'].value;
  service.setZone(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.addZone = function addZone (req, res, next) {
  const service = container.resolve('zoneService');
  var body = req.swagger.params['body'].value;
  service.addZone(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};