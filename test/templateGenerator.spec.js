const assert = require('assert');
const container = require('../src/diContainer');
const expect = require('chai').expect;
const should = require('chai').should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const path = require('path');
const fs = require('fs');

const testDataModel = {
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
};

describe('TemplateGenerator', async function() {

    describe('genenerate', async function(){
  
      it('should generate valid main configuration', async function(){
          const generator = container.resolve('templateGenerator');
          await generator.initialiseTemplates();
          const fileContents = generator.generateMainConfig(testDataModel);
          expect(fileContents).to.be.not.empty;
      });

      it('should generate valid zone configuration', async function(){
        const generator = container.resolve('templateGenerator');
        await generator.initialiseTemplates();
        const fileContents = generator.generateZoneConfig(testDataModel, 0);
        expect(fileContents).to.be.not.empty;
      });

      it('should write out valid files to disk', async function(){
          const tempMainFile = path.join(__dirname, '..', 'temp', 'named.conf');
          const zoneFilePath = path.join(__dirname, '..', 'temp');
          console.log('Zone path: ' + zoneFilePath)
          if (!fs.existsSync(zoneFilePath)) {
            fs.mkdirSync(zoneFilePath);
          }
          const generator = container.resolve('templateGenerator');
          await generator.initialiseTemplates();
          await generator.generateConfigs(testDataModel, tempMainFile, zoneFilePath);
      });

    });
});