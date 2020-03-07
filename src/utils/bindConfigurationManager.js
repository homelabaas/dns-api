const fs = require('fs').promises;
const fssync = require('fs');
const config = require('config');
const bindManager = require('./bindManager');

module.exports = class BindConfigurationManager{

  constructor(opts) {
    this.templateGenerator = opts.templateGenerator;
    this.dnsRepository = opts.dnsRepository;
    this.initialized = false;
    this.bindIsRunning = false;
  }

  async reconfigureBind() {
    if (!this.initialized) {
      if (!fssync.existsSync(config.get('Paths.ZonePath'))) {
        await fs.mkdir(config.get('Paths.ZonePath'));
      }
      this.initialized = true;
      await this.templateGenerator.initialiseTemplates();
    }
    await this.templateGenerator.generateConfigs(this.dnsRepository.getFullConfig(), 
      config.get('Paths.MainConfigFile'), config.get('Paths.ZonePath'));

    if (this.bindIsRunning) {
      process.stdout.write('Reload bind configuration.\n');
      bindManager.reloadBind();
    } else {
      process.stdout.write('Start bind process.\n');
      bindManager.runBind();
      this.bindIsRunning = true;
    }
  }

}