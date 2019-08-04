const { spawn } = require('child_process');
const http = require('http');
const app = require('connect')();
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fspromise = require('fs').promises;
const fs = require('fs');
const path = require('path');
const config = require('config');

const container = require('./diContainer').container;
const port = process.env.port || 80;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: false,

};

const spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

const testContent = {
  dns1: '192.168.0.1',
  dns2: '192.168.0.2',
  zones: [
      {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.',
          records: [
              {
                  fqdn: 'test',
                  type: 'A',
                  address: '192.168.0.1'
              },
              {
                fqdn: 'ns',
                type: 'A',
                address: '192.168.0.1'
              }
          ]
      },
      {
          name: 'test2.com',
          filename: 'db.test2.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test2.com.',
          adminEmail: 'admin.test2.com.',
          records: [
              {
                  fqdn: 'test',
                  type: 'A',
                  address: '192.168.0.2'
              },
              {
                fqdn: 'ns',
                type: 'A',
                address: '192.168.0.1'
              }
          ]
      }
  ]
}


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());

  http.createServer(app).listen(port, async function () {
    await generationConfigurationFiles();
    await runBind();
    console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
    console.log('Swagger-ui is available on http://localhost:%d/docs', port);
  });

});

const generationConfigurationFiles = async () => {
  await fspromise.mkdir(config.get('Paths.ZonePath'));
  const generator = container.resolve('templateGenerator');
  await generator.initialiseTemplates();
  await generator.generateConfigs(testContent, config.get('Paths.MainConfigFile'), config.get('Paths.ZonePath'));
}

const runBind = async () => {

  const bind = spawn('named', ['-c', '/etc/bind/named.conf', '-g', '-u', 'named']);

  bind.stdout.on('data', (data) => {
      console.log(`bind_stdout: ${data}`);
  });

  bind.stderr.on('data', (data) => {
      console.log(`bind_stderr: ${data}`);
  });

  bind.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
  });
}