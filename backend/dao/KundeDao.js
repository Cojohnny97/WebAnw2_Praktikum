const helper = require('../helper.js')

class KundeDao {

    constructor(connection) {
        this._conn = connection
    }

    getById(id) {
        var sql = 'SELECT * FROM Kunde WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No Record found by id=' + id)
        }
        result = helper.objectKeysToLower(result)
        result.anrede = result.anrede == 0 ? 'Herr' : 'Frau'
        
        return result
    }

    getAll () {
        var sql = 'SELECT * FROM Kunde'
        var statement = this._conn.prepare(sql)
        var result = statement.all()

        if (helper.isArrayEmpty(result)) {
            return []
        }
        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            result[i].anrede = result[i].anrede == 0 ? 'Herr' : 'Frau'
        }
        return result
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Kunde WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt == 1 ? true : false
    }

    create(anrede = 'Herr', vorname = '', nachname = '', email = '', telefonnummer = '', adresse = '', plz = null, ort='') {
        var sql = 'INSERT INTO Kunde (Anrede,Vorname,Nachname,Email,Telefonnummer,Adresse,Plz,Ort) VALUES (?,?,?,?,?,?,?,?)'
        var statement = this._conn.prepare(sql)
        var params = [(anrede == 'Herr' ? 0 : 1), vorname, nachname, email, telefonnummer, adresse, plz, ort]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }
        return this.getById(result.lastInsertRowid)
    }

    update(id, anrede = 'Herr', vorname = '', nachname = '', email = '', telefonnummer = '', adresse = '', plz = null, ort='') {
        var sql = 'UPDATE Kunde SET Anrede=?,Vorname=?,Nachname=?,Email=?,Telefonnummer=?,Adresse=?,Plz=?,Ort=? WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var params = [(anrede == 'Herr' ? 0 : 1), vorname, nachname, email, telefonnummer, adresse, plz, ort, id]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not update existing Record. Data: ' + params)
        }
        return this.loadById(id)
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Kunde WHERE ID=?'
            var statement = this._conn.prepare(sql)
            var result = statement.run(id)

            if (result.changes != 1) {
                throw new Error('Could not delete Record by id=' + id)
            }
            return true
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message)
        }
    }

    toString() {
        helper.log('KundeDao [_conn=' + this._conn + ']')
    }
}

module.exports = KundeDao