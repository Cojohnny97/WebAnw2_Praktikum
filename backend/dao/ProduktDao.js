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

        result.kategorie = kategorieDao.getById(result.kategorieId)
        delete result.kategorieId

        result.mehrwertsteuer = mehrwertsteuerDao.getById(result.mwstId)
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
            result[i].mehrwertsteuer = taxes.find(tax => tax.id === result[i].mwstId)
            delete result[i].mwstId

            result[i].kategorie = categories.find(c => c.id === result[i].kategorieId)
            delete result[i].kategorieId

            result[i].bruttopreis = helper.round(result[i].nettopreis + (result[i].nettopreis * (result[i].mehrwertsteuer.satz / 100)))
        }

        return result
    }

    getByParent(kategorieId) {
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
            result[i].mehrwertsteuer = taxes.find(tax => tax.id === result[i].mwstId)
            delete result[i].mwstId

            result[i].kategorie = categories.find(c => c.id === result[i].kategorieId)
            delete result[i].kategorieId

            result[i].bruttopreis = helper.round(result[i].nettopreis + (result[i].nettopreis * (result[i].mehrwertsteuer.satz / 100)))
        }

        return result
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Produkt WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt == 1 ? true : false
    }
}

module.exports = ProduktDao