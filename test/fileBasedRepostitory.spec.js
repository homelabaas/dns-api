const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const FileBasedRepository = require('../src/data/fileBasedRepository');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const path = require('path');
const fs = require('fs');

const tempMainFile = path.join(__dirname, '..', 'temp', 'filerepository.json');

describe('FileBasedRepository', async function() {

  describe('set main config', async function(){
  
    it('should allow the dns forwarders to be set', async function(){
      if (fs.existsSync(tempMainFile)) {
        fs.unlinkSync(tempMainFile);
      }
      const config = require('config');
      const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
      await repository.initialise();
      await repository.setConfig([ '10.0.0.0', '10.0.0.1']);
      const allData = repository.getFullConfig();
      expect(allData.dnsforwarders).to.be.of.length(2);
    });

  });

    describe('save and load', async function(){
  
      it('should initialise properly then save', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.save();
      });

      it('should load from an existing file if one exists', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.addZone('test.com', {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.'
        });
        const repositoryTwo = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repositoryTwo.initialise();
        const allData = repositoryTwo.getFullConfig();
        expect(allData.zones).to.contain.keys(['test.com']);
      });

    });

    
    describe('manage zones', async function(){
  
      it('add a new zone', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.addZone('test.com', {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.'
        });
        const allData = repository.getFullConfig();
        expect(allData.zones).to.contain.keys(['test.com']);
      });

      it('add and remove a zone', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.addZone('test.com', {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.'
        });
        await repository.addZone('test2.com', {
          name: 'test2.com',
          filename: 'db.test2.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test2.com.',
          adminEmail: 'admin.test2.com.'
        });
        await repository.removeZone('test.com');
        const allData = repository.getFullConfig();
        expect(allData.zones).to.not.contain.keys(['test.com']);
      });

    });

    describe('manage records', async function(){
  
      it('add a new record', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.addZone('test.com', {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.'
        });
        await repository.addRecord('test.com', {
          name: 'test.test.com',
          type: 'A',
          address: '10.0.0.1'
        });
        const allData = repository.getFullConfig();
        expect(allData.zones['test.com'].records).to.be.of.length(1);
      });

      it('add and remove records', async function(){
        if (fs.existsSync(tempMainFile)) {
          fs.unlinkSync(tempMainFile);
        }
        const config = require('config');
        const repository = new FileBasedRepository({ fileRespositoryFilePath: tempMainFile });
        await repository.initialise();
        await repository.addZone('test.com', {
          name: 'test.com',
          filename: 'db.test.com',
          TTL: 3600,
          serial: 1,
          primarymaster: 'ns.test.com.',
          adminEmail: 'admin.test.com.'
        });
        await repository.addRecord('test.com', {
          name: 'test.test.com',
          type: 'A',
          address: '10.0.0.1'
        });
        await repository.addRecord('test.com', {
          name: 'testblah.test.com',
          type: 'A',
          address: '10.0.0.2'
        });
        await repository.removeRecordByName('test.com','testblah.test.com');
        const allData = repository.getFullConfig();
        expect(allData.zones['test.com'].records).to.be.of.length(1);
      });

    });
});