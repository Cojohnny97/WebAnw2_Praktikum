const helper = require('../helper.js')

class MehrwertsteuerDao {

    constructor(connection) {
        this._conn = connection
    }

    getById (id) {
        var sql = 'SELECT * FROM Mehrwertsteuer WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No record found by id=' + id)
        }

        result = helper.objectKeysToLower(result)

        return result
    }

    getAll () {
        var sql = 'SELECT * FROM Mehrwertsteuer'
        var statement = this._conn.prepare(sql)
        var result = statement.all()

        return helper.isArrayEmpty(result) ? [] : helper.arrayObjectKeysToLower(result)

    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Mehrwertsteuer WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt === 1 ? true : false
    }

    create(name = '', satz = 19.0) {
        var sql = 'INSERT INTO Mehrwertsteuer (Name,Satz) VALUES (?,?)'
        var statement = this._conn.prepare(sql)
        var params = [name, satz]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }

        var newObj = this.getById(result.lastInsertRowid)
        return newObj;
    }

    update(id, name = '', satz = 19.0) {
        var sql = 'UPDATE Mehrwertsteuer SET Name=?,Satz=? WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var params = [name, satz, id]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not update existing Record. Data: ' + params)
        }

        var updatedObj = this.getById(id)
        return updatedObj
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Mehrwertsteuer WHERE ID=?'
            var statement = this._conn.prepare(sql)
            var result = statement.run(id)

            if (result.changes != 1)  {
                throw new Error('Could not delete Record by id=' + id)
            }
            return true
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message)
        }
    }

    toString() {
        helper.log('MehrwertsteuerDao [_conn=' + this._conn + ']')
    }

}

module.exports = MehrwertsteuerDao