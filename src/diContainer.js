const awilix = require('awilix');
const fileBaseRepository = require('./data/fileBasedRepository');
const configurationService = require('./service/ConfigurationService');
const templateGenerator = require('./utils/templateGenerator');
const bindConfigurationManager = require('./utils/bindConfigurationManager');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

// Dependency Injection Container - register implementations here
container.register({
  dnsRepository: awilix.asClass(fileBaseRepository),
  configurationService: awilix.asClass(configurationService),
  templateGenerator: awilix.asClass(templateGenerator),
  bindConfigurationManager: awilix.asClass(bindConfigurationManager)
});

module.exports = container;