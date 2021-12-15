const helper = require('../helper.js')
const KundeDao = require('./KundeDao.js')


class BewerberDao {

    constructor(connection) {
        this._conn = connection
    }

    getById(id) {
        const kundeDao = new KundeDao(this._conn)

        var sql = 'SELECT * FROM Bewerber WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No Record found by id=' + id)
        }
        result = helper.objectKeysToLower(result)
        result.kunde = kundeDao.getById(result.kundeid)
        delete result.kundeid

        return result
    }

    create(kunde = {}, schulausbildung = 0, arbeitsplatz = 0, vorerfahrung = 0) {
        const kundeDao = new KundeDao(this._conn)

        let kundeObj = kundeDao.create(kunde.anrede, kunde.vorname, kunde.nachname, kunde.email, kunde.telefonnummer, kunde.adresse, kunde.plz, kunde.ort)

        var sql = 'INSERT INTO Bewerber (KundeID,Schulausbildung,Arbeitsplatz,Vorerfahrung) VALUES (?,?,?,?)'
        var statement = this._conn.prepare(sql)
        var params = [kundeObj.id, schulausbildung,arbeitsplatz, vorerfahrung]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }

        return this.getById(result.lastInsertRowid)
    }
}

module.exports = BewerberDao