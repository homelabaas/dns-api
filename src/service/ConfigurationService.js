module.exports = class ConfigurationService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getConfig() {
    console.log('Get config');
    return this.repository.getConfig();
  }

  async setConfig(config) {
    console.log('Set config');
    await this.repository.setConfig(config);
    await this.bindConfigurationManager.reconfigureBind();
  }
}