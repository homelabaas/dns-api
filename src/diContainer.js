const awilix = require('awilix');
const fileBaseRepository = require('./data/fileBasedRepository');
const configurationService = require('./service/ConfigurationService');
const templateGenerator = require('./utils/templateGenerator');
const bindConfigurationManager = require('./utils/bindConfigurationManager');
const Lifetime = awilix.Lifetime;

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

// Dependency Injection Container - register implementations here
container.register({
  dnsRepository: awilix.asClass(fileBaseRepository, { lifetime: Lifetime.SINGLETON }),
  configurationService: awilix.asClass(configurationService),
  templateGenerator: awilix.asClass(templateGenerator, { lifetime: Lifetime.SINGLETON }),
  bindConfigurationManager: awilix.asClass(bindConfigurationManager)
});

module.exports = container;