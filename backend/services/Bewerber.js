const helper = require('../helper.js')
const BewerberDao = require('../dao/BewerberDao.js')
const express = require('express')
var serviceRouter = express.Router()

helper.log('- Service Bewerber')


serviceRouter.get('/bewerber/gib/:id', function(request, response) {
    helper.log('Service Bestellung: Client requested one record, id=' + request.params.id)

    const bewerberDao = new BewerberDao(request.app.locals.dbConnection)
    try {
        var result = bewerberDao.getById(request.params.id)
        helper.log('Service Bewerber: Record loaded')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Bewerber: Error loading record by id. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
})

serviceRouter.post('/bewerber', function(request, response) {
    helper.log('Service Bewerber: Client requested creation of new record')

    var errorMsgs=[]
    if (helper.isUndefined(request.body.kunde)) 
        errorMsgs.push('Kundendaten fehlen')
    if (helper.isUndefined(request.body.arbeitsplatz))
        errorMsgs.push('Arbeitsplatz fehlt')
    if (helper.isUndefined(request.body.schulausbildung))
        errorMsgs.push('Schulausbildung fehlt')
    if (helper.isUndefined(request.body.vorerfahrung))
        errorMsgs.push('Vorerfahrung fehlt')

    if (errorMsgs.length > 0) {
        helper.log('Service Bewerber: Creation not possible, data missing')
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)))
        return
    }
    
    const bewerberDao = new BewerberDao(request.app.locals.dbConnection)
    try {
        var result = bewerberDao.create(request.body.kunde, request.body.schulausbildung, request.body.arbeitsplatz, request.body.vorerfahrung)
        helper.log('Service Bewerber: Record inserted')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Bewerber: Error creating new record. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }    
})

module.exports = serviceRouter