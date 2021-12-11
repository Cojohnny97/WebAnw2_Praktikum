const helper = require('../helper.js');
const ProduktDao = require('./ProduktDao.js');
const MehrwertsteuerDao = require('./MehrwertsteuerDao.js');

class BestellpositionDao {

    constructor(connection) {
        this._conn = connection
    }

    getConnection() {
        return this._conn
    }

    getById(id) {
        const produktDao = new ProduktDao(this._conn)
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)

        var sql = 'SELECT * FROM Bestellposition WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No Record found by id=' + id)
        }

        result = helper.objectKeysToLower(result)

        result.bestellung = { 'id': result.bestellid }
        delete result.bestellid
        
        result.produkt = produktDao.getById(result.productid)
        delete result.productid

        result.nettosumme = result.durchmesser && result.durchmesser == 30 ? helper.round(result.menge * (result.produkt.nettopreis + result.produkt.aufpreis || 0)) : helper.round(result.menge * result.produkt.nettopreis) // bswp: 2 * (5,00 + 2,00) = 14,00€
        result.mehrwertsteuersumme = (mehrwertsteuerDao.getById(result.produkt.mehrwertsteuer.id).satz / 100) * result.nettosumme // bspw. 0,19 * 14) = 2,66€
        result.bruttosumme = helper.round(result.nettosumme + result.mehrwertsteuersumme) // bspw: 14,00 + 2,66 = 16,66€

        return result
    }

    getAll() {
        const produktDao = new ProduktDao(this._conn)
        var products = produktDao.getAll()
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)

        var sql = 'SELECT * FROM Bestellposition'
        var statement = this._conn.prepare(sql)
        var result = statement.all()

        if (helper.isArrayEmpty(result)) {
            return []
        }
        
        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            result[i].bestellung = { 'id': result[i].bestellid }
            delete result[i].bestellid
        
            for (let p = 0; p < products.length; p++) {
                if (products[p].id == result[i].productid) {
                    result[i].produkt = products[p]
                    break
                }
            }
            delete result[i].productid

            result[i].nettosumme = result[i].durchmesser && result[i].durchmesser == 30 ? helper.round(result[i].menge * (result[i].produkt.nettopreis + result[i].produkt.aufpreis || 0)) : helper.round(result[i].menge * result[i].produkt.nettopreis)
            result[i].mehrwertsteuersumme = (mehrwertsteuerDao.getById(result[i].produkt.mehrwertsteuer.id).satz / 100) * result[i].nettosumme 
            result[i].bruttosumme = helper.round(result[i].nettosumme + result[i].mehrwertsteuersumme)
        }

        return result
    }

    getByParent(bestellId) {
        const produktDao = new ProduktDao(this._conn)
        var products = produktDao.getAll()
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn)


        var sql = 'SELECT * FROM Bestellposition WHERE BestellID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.all(bestellId)

        if (helper.isArrayEmpty(result)) {
            return []
        }
        
        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            result[i].bestellung = { 'id': result[i].bestellid }
            delete result[i].bestellid
        
            for (let p = 0; p < products.length; p++) {
                if (products[p].id == result[i].productid) {
                    result[i].produkt = products[p]
                    break
                }
            }
            delete result[i].productid
            
            result[i].nettosumme = result[i].durchmesser && result[i].durchmesser == 30 ? helper.round(result[i].menge * (result[i].produkt.nettopreis + result[i].produkt.aufpreis || 0)) : helper.round(result[i].menge * result[i].produkt.nettopreis) 
            result[i].mehrwertsteuersumme = (mehrwertsteuerDao.getById(result[i].produkt.mehrwertsteuer.id).satz / 100) * result[i].nettosumme 
            result[i].bruttosumme = helper.round(result[i].nettosumme + result[i].mehrwertsteuersumme)
        }

        return result
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Bestellposition WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        return result.cnt == 1 ? true : false
    }

    create(productid = 1, bestellid = 1,  durchmesser, auswahl, menge = 1) {
        var sql = 'INSERT INTO Bestellposition (ProductID,BestellID,Durchmesser,Auswahl,Menge) VALUES (?,?,?,?,?)'
        var statement = this._conn.prepare(sql)
        var params = [productid, bestellid, durchmesser, auswahl, menge]
        var result = statement.run(params)

        if (result.changes != 1) {
            throw new Error('Could not insert new Record. Data: ' + params)
        }

        return this.getById(result.lastInsertRowid)
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Bestellposition WHERE ID=?'
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

    deleteByParent(bestellId) {
        try {
            var sql = 'DELETE FROM Bestellposition WHERE BestellID=?'
            var statement = this._conn.prepare(sql)
            statement.run(bestellId)
            return true
        } catch (ex) {
            throw new Error('Could not delete Records by bestellungid=' + bestellungid + '. Reason: ' + ex.message)
        }
    }

    toString() {
        helper.log('BestellpositionDao [_conn=' + this._conn + ']');
    }
}

module.exports = BestellpositionDao;