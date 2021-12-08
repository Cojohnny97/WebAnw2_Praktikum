const helper = require('../helper.js')
const KategorieDao = require('./KategorieDao.js');
const MehrwertsteuerDao = require('./MehrwertsteuerDao.js');

class ProduktDao {

    constructor (connection) {
        this._conn = connection
    }

    getById(id) {
        const kategorieDao = new KategorieDao(this._conn)
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)

        var sql = 'SELECT * FROM Produkt WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)
        
        result = helper.objectKeysToLower(result)
        result.kategorie = kategorieDao.getById(result.kategorieid)
        delete result.kategorieId

        result.mehrwertsteuer = mehrwertsteuerDao.getById(result.mwstid)
        delete result.mwstId

        result.bruttopreis = helper.round(result.nettopreis + (result.nettopreis * (result.mehrwertsteuer.satz / 100)))
        return result
    }

    getAll() {
        const kategorieDao = new KategorieDao(this._conn)
        var categories = kategorieDao.getAll()
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)
        var taxes = mehrwertsteuerDao.getAll()

        var sql = 'SELECT * FROM Produkt'
        var statement = this._conn.prepare(sql)
        var result = statement.all()

        if (helper.isArrayEmpty(result)) {
            return []
        }
        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            for (let t = 0; t < taxes.length; t++) {
                if (taxes[t].id == result[i].mwstid) {
                    result[i].mehrwertsteuer = taxes[t]
                }
            }
            delete result[i].mwstid

            for (let c = 0; c < categories.length; c++) {
                if (categories[c].id == result[i].kategorieid) {
                    result[i].kategorie = categories[c]
                    break
                }
            }
            delete result[i].kategorieid
            result[i].bruttopreis = helper.round(result[i].nettopreis + (result[i].nettopreis * (result[i].mehrwertsteuer.satz / 100)))
        }

        return result
    }

    getByCategory(kategorieId) {
        const kategorieDao = new KategorieDao(this._conn)
        var categories = kategorieDao.getAll()
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)
        var taxes = mehrwertsteuerDao.getAll()
        
        var sql = 'SELECT * FROM Produkt WHERE kategorieID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.all(kategorieId)

        if (helper.isArrayEmpty(result)) {
            return []
        }

        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            for (let t = 0; t < taxes.length; t++) {
                if (taxes[t].id == result[i].mwstid) {
                    result[i].mehrwertsteuer = taxes[t]
                    break
                }
            }
            delete result[i].mwstid

            for (let c = 0; c < categories.length; c++) {
                if (categories[c].id == result[i].kategorieid) {
                    result[i].kategorie = categories[c]
                    break
                }
            }
            delete result[i].kategorieid
            result[i].bruttopreis = helper.round(result[i].nettopreis + (result[i].nettopreis * (result[i].mehrwertsteuer.satz / 100)))
            console.log(result[i])
        }
        return result
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Produkt WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt == 1 ? true : false 
    }

    create(name = '',  beschreibung = '', nettopreis = 0.0, aufpreis = 0.0, bildpfad = '', mwstId = 1, kategorieId = 1) {
        var sql = 'INSERT INTO Produkt (Name,Beschreibung,Nettopreis,Aufpreis,Bildpfad,MwstID,KategorieID) VALUES (?,?,?,?,?,?,?)'
        var statement = this._conn.prepare(sql)
        var params = [name, beschreibung, nettopreis, aufpreis, bildpfad, mwstId, kategorieId]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }

        return this.getById(result.lastInsertRowid)
    }

    update(id, name = '',  beschreibung = '', nettopreis = 0.0, aufpreis = 0.0, bildpfad = '', mwstId = 1, kategorieId = 1) {
        var sql = 'UPDATE Produkt SET Name=?,Beschreibung=?,Nettopreis=?,Aufpreis=?,Bildpfad=?,MwstID=?,KategorieID=? WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var params = [name, beschreibung, nettopreis, aufpreis, bildpfad, mwstId, kategorieId, id]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }

        return this.getById(id)
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Produkt WHERE ID=?'
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
        helper.log('ProduktDao [_conn=' + this._conn + ']')
    }
}

module.exports = ProduktDao