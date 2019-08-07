module.exports = class ConfigurationService {
  constructor(opts) {
    this.repository = opts.dnsRepository;
  }

  getConfig() {
    console.log('Get config');
    return this.repository.getFullConfig();
  }
}