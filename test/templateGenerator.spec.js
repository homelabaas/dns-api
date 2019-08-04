const assert = require('assert');
const container = require('../src/diContainer');
const expect = require('chai').expect;
const should = require('chai').should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const path = require('path');
const fs = require('fs');

const testDataModel = require('../src/utils/initialiseDnsData');

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