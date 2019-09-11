const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getZoneById = function getZoneById (req, res, next) {
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

module.exports.deleteZoneById = async function deleteZoneById (req, res, next) {
  const service = container.resolve('zoneService');
  var zoneId = req.swagger.params['id'].value;
  try {
    const returnValue = await service.deleteZone(zoneId);
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

module.exports.setZone = async function setZone (req, res, next) {
  const service = container.resolve('zoneService');
  var body = req.swagger.params['body'].value;
  try {
    const returnValue = await service.setZone(body);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
};

module.exports.addZone = async function addZone (req, res, next) {
  const service = container.resolve('zoneService');
  var body = req.swagger.params['body'].value;
  try {
    const returnValue = await service.addZone(body);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  } 
};