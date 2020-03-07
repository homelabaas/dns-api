
const http = require('http');
const app = require('connect')();
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const container = require('./diContainer');
const bindManager = require('./utils/bindManager');
const port = process.env.port || 80;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: false,

};

const spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

var startServer = function startServer(app) {
  return new Promise((resolve,reject) => {
    http.createServer(app).listen(port,() => {
      resolve();
    });
  });
}

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, async function (middleware) {

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());

  await container.resolve('dnsRepository').initialise();
  await bindManager.configureRndc();
  await bindManager.ownConfig();
  await container.resolve('bindConfigurationManager').reconfigureBind();

  await startServer(app);

  process.stdout.write(`Your server is listening on port ${port} (http://localhost:${port})\n`);
  process.stdout.write(`Swagger-ui is available on http://localhost:${port}/docs \n`);

});