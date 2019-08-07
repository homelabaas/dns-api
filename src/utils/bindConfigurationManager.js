const fs = require('fs').promises;
const testContent = require('./initialiseDnsData');
const config = require('config');

module.exports = class BindConfigurationManager{

  constructor(opts) {
    this.templateGenerator = opts.templateGenerator;
    this.dnsRepository = opts.dnsRepository;
    this.initialized = false;
  }

  async reconfigureBind() {
    await fs.mkdir(config.get('Paths.ZonePath'));
    if (!this.initialized) {
      this.initialized = true;
      await this.templateGenerator.initialiseTemplates();
    }
    await this.templateGenerator.generateConfigs(this.dnsRepository.getFullConfig(), config.get('Paths.MainConfigFile'), config.get('Paths.ZonePath'));

    // Tell bind to reload
  }

}