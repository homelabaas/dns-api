const utils = require('../utils/writer.js');
const container = require('../diContainer');

module.exports.getRecordsByZoneId = async function getRecordsByZoneId (req, res, next) {
  const service = container.resolve('recordService');
  var zoneId = req.swagger.params['id'].value;
  try {
    const returnValue = service.getRecordsByZoneId(zoneId);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}

module.exports.addRecordForZoneId = async function addRecordForZoneId (req, res, next) {
  const service = container.resolve('recordService');
  var zoneId = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  try {
    const returnValue = await service.addRecordForZoneId(zoneId, body);
    utils.writeJson(res, returnValue);
  } catch (error) {
    console.error('Error', error);
    utils.writeJson(res, { "error": error.message });
  }
}
