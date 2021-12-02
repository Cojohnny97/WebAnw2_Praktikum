const helper = require('../helper.js')
const BestellpositionDao = require('./BestellpositionDao.js')
const KundeDao = require('./KundeDao.js')

class BestellungDao {

    constructor (connection) {
        this._conn = connection
    }

    getById(id) {
        const bestellpositionDao = new BestellpositionDao(this._conn)
        const kundeDao = new KundeDao(this._conn)
            
        var sql = 'SELECT * FROM Bestellung WHERE ID=?'
        var statement = this._conn.prepare(sql)
        var result = statement.get(id)

        if (helper.isUndefined(result)) {
            throw new Error('No Record found by id=' + id)
        }
        result = helper.objectKeysToLower(result)
        result.zeitpunkt = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result.zeitpunkt))

        
        result.kunde = helper.isNull(result.kundeId) ? null : kundeDao.getById(result.kundeId)
        delete result.kundeId

        result.bestellpositionen = bestellpositionDao.getByParent(result.id)

        result.total = { 'netto': 0, 'brutto': 0, 'mehrwertsteuer': 0 }

        for (i = 0; i < result.bestellpositionen.length; i++) {
            result.total.netto += result.bestellpositionen[i].nettosumme
            result.total.brutto += result.bestellpositionen[i].bruttosumme
            result.total.mehrwertsteuer += result.bestellpositionen[i].mehrwertsteuersumme
        }

        result.total.netto = helper.round(result.total.netto)
        result.total.brutto = helper.round(result.total.brutto)
        result.total.mehrwertsteuer = helper.round(result.total.mehrwertsteuer)

        return result
    }

    getAll() {
        const bestellpositionDao = new BestellpositionDao(this._conn)
        var positions = bestellpositionDao.loadAll()
        const kundeDao = new KundeDao(this._conn)
        var kunden = kundeDao.loadAll();

        var sql = 'SELECT * FROM Bestellung';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) {
            return []
        }

        result = helper.arrayObjectKeysToLower(result)

        for (let i = 0; i < result.length; i++) {
            result[i].zeitpunkt = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result[i].zeitpunkt));

            if (helper.isNull(result[i].kundeId)) {
                result[i].kunde = null
            } else {
                for (let kunde of kunden) {
                    if (kunde.id == result[i].kundeId) {
                        result[i].kunde = kunde
                        break
                    }
                }
            }
            delete result[i].kundeId

            result[i].bestellpositionen = []

            result[i].total = { 'netto': 0, 'brutto': 0, 'mehrwertsteuer': 0 }

            for (let position of positions) {
                if (position.bestellung.id == result[i].id) {
                    result[i].total.netto += position.nettosumme
                    result[i].total.brutto += position.bruttosumme
                    result[i].total.mehrwertsteuer += position.mehrwertsteuersumme
                    result[i].bestellpositionen.push(position)
                }                
            }

            result[i].total.netto = helper.round(result[i].total.netto)
            result[i].total.brutto = helper.round(result[i].total.brutto)
            result[i].total.mehrwertsteuer = helper.round(result[i].total.mehrwertsteuer)
        }

        return result
    }
}

module.exports = BestellungDao