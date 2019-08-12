module.exports = class Zone {
  constructor(name, TTL, adminEmail, nsaddress) {
    this.name = name;
    this.TTL = TTL;
    this.adminEmail = adminEmail;
    this.filename = 'db.' + this.name;
    this.serial = 1;
    this.primarymaster = 'ns.' + this.name + '.';
    if (nsaddress) {
      this.records = [
        {
          fqdn: 'ns',
          type: 'A',
          address: nsaddress
        }
      ]
    }
  }
}