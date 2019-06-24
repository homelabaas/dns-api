export const createDataModel = (dns1, dns2, zones) => {
    return {
        dns1,
        dns2,
        zones
    }
}

export const createZone = (name, records) => {
    return {
        name,
        filename: `/etc/bind/zones/db.name`,
        records
    }
}

export const createRecord = (type, fqdn, address) => {
    return {
        fqdn, type, address
    }
}

