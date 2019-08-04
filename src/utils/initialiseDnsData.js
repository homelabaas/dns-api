module.exports = {
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