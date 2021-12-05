const helper = require('../helper.js');

class KategorieDao {

    constructor(connection) {
        this._conn = connection
    }

    getById(id) {
        var sql = 'SELECT * FROM Kategorie WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No Record found by id=' + id)
        }
        result = helper.objectKeysToLower(result)
        return result
    }

    getAll () {
        var sql = 'SELECT * from Kategorie'
        var statement = this._conn.prepare(sql)
        var result = statement.all()

        if (helper.isArrayEmpty(result)) {
            return []
        }

        return helper.arrayObjectKeysToLower(result)
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Kategorie WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt == 1 ? true : false
    }

    create(name = '', beschreibung = '', bildpfad = '') {
        var sql = 'INSERT INTO Kategorie (Name,Beschreibung,Bildpfad) VALUES (?,?,?)'
        var statement = this._conn.prepare(sql)
        var params = [name, beschreibung, bildpfad]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }
        return this.getById(result.lastInsertRowid)
    }

    update(id, name = '', beschreibung = '', bildpfad = '') {
        var sql = 'UPDATE Kategorie SET Name=?,Beschreibung=?,Bildpfad=? WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var params = [name, beschreibung, bildpfad, id]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not update existing Record. Data: ' + params)
        }
        return this.getById(id)
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Kategorie WHERE ID=?'
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
        helper.log('KategorieDao [_conn=' + this._conn + ']')
    }
}

module.exports = KategorieDao