module.exports = class ConfigurationService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
    this.bindConfigurationManager = opts.bindConfigurationManager;
  }

  getConfig() {
    return this.repository.getConfig();
  }

  async setConfig(config) {
    process.stdout.write('Set full config.\n');
    await this.repository.setConfig(config);
    await this.bindConfigurationManager.reconfigureBind();
    return { 'message': "DNS forwarders set OK."};
  }
}