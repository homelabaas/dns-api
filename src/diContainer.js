const awilix = require('awilix');
const fileBaseRepository = require('./data/fileBasedRepository');
const configurationService = require('./service/ConfigurationService');
const zoneService = require('./service/ZoneService');
const recordService = require('./service/RecordService');
const templateGenerator = require('./utils/templateGenerator');
const bindConfigurationManager = require('./utils/bindConfigurationManager');
const config = require('config');
const Lifetime = awilix.Lifetime;

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

// Dependency Injection Container - register implementations here
container.register({
  dnsRepository: awilix.asClass(fileBaseRepository, { lifetime: Lifetime.SINGLETON }),
  configurationService: awilix.asClass(configurationService, { lifetime: Lifetime.SINGLETON }),
  zoneService: awilix.asClass(zoneService, { lifetime: Lifetime.SINGLETON }),
  recordService: awilix.asClass(recordService, { lifetime: Lifetime.SINGLETON }),
  templateGenerator: awilix.asClass(templateGenerator, { lifetime: Lifetime.SINGLETON }),
  bindConfigurationManager: awilix.asClass(bindConfigurationManager, { lifetime: Lifetime.SINGLETON }),
  fileRespositoryFilePath: awilix.asValue(config.get("Paths.DNSRepositoryFile"))
});

module.exports = container;