const assert = require('assert');
const TemplateGenerator = require('../src/templateGenerator');

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
            records: [
                {
                    fqdn: 'test.test.com',
                    type: 'A',
                    address: '192.168.0.1'
                }
            ]
        },
        {
            name: 'test2.com',
            filename: 'db.test2.com',
            records: [
                {
                    fqdn: 'test.test2.com',
                    type: 'A',
                    address: '192.168.0.2'
                }
            ]
        }
    ]
}

describe('TemplateGenerator', function () {

    describe('genenerate', function(){
  
      it('should generate valid main configuration', function(){
          const generator = new TemplateGenerator();
          const fileContents = generator.generateMainConfig(testDataModel);
          expect(fileContents).to.be.not.empty;
      });

      it('should generate valid zone configuration', function(){
        const generator = new TemplateGenerator();
        const fileContents = generator.generateZoneConfig(testDataModel, 0);
        expect(fileContents).to.be.not.empty;
      });

      it('should write out valid files to disk', function(){
          const tempMainFile = path.join(__dirname, '..', 'temp', 'named.conf');
          const zoneFilePath = path.join(__dirname, '..', 'temp');
          console.log('Zone path: ' + zoneFilePath)
          if (!fs.existsSync(zoneFilePath)) {
            fs.mkdirSync(zoneFilePath);
          }
          const generator = new TemplateGenerator();
          generator.generateConfigs(testDataModel, tempMainFile, zoneFilePath);
      });

    });
});