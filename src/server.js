
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

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());

  http.createServer(app).listen(port, async function () {
    await container.resolve('dnsRepository').initialise();
    await container.resolve('bindConfigurationManager').reconfigureBind();
    await bindManager.runBind();
    console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
    console.log('Swagger-ui is available on http://localhost:%d/docs', port);
  });

});