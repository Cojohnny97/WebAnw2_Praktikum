const helper = require('../helper.js')
const KategorieDao = require('../dao/KategorieDao.js')
const express = require('express')
var serviceRouter = express.Router()

helper.log('- Service Kategorie')

serviceRouter.get('/kategorie/gib/:id', function(request, response) {
    helper.log('Service Kategorie: Client requested one record, id=' + request.params.id)

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var result = kategorieDao.getById(request.params.id)
        helper.log('Service Kategorie: Record loaded')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Kategorie: Error loading record by id. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

serviceRouter.get('/kategorie/alle', function(request, response) {
    helper.log('Service Kategorie: Client requested all records')

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var result = kategorieDao.getAll()
        helper.log('Service Kategorie: Records loaded, count=' + result.length)
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Kategorie: Error loading all records. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

serviceRouter.get('/kategorie/existiert/:id', function(request, response) {
    helper.log('Service Kategorie: Client requested check, if record exists, id=' + request.params.id)

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var result = kategorieDao.exists(request.params.id)
        helper.log('Service Kategorie: Check if record exists by id=' + request.params.id + ', result=' + result)
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }))
    } catch (ex) {
        helper.logError('Service Kategorie: Error checking if record exists. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
})

serviceRouter.post('/kategorie', function(request, response) {
    helper.log('Service Kategorie: Client requested creation of new record')

    var errorMsgs=[]
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt')
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push('Beschreibung fehlt')
    if (helper.isUndefined(request.body.bildpfad)) 
        errorMsgs.push('Bildpfad fehlt')
    
    if (errorMsgs.length > 0) {
        helper.log('Service Kategorie: Creation not possible, data missing')
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)))
        return
    }

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var result = kategorieDao.create(request.body.name, request.body.beschreibung, request.body.bildpfad)
        helper.log('Service Kategorie: Record inserted')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Kategorie: Error creating new record. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }    
})

serviceRouter.put('/kategorie', function(request, response) {
    helper.log('Service Kategorie: Client requested update of existing record')

    var errorMsgs=[]
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt')
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt')
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push('Beschreibung fehlt')
    if (helper.isUndefined(request.body.bildpfad)) 
        errorMsgs.push('Bildpfad fehlt')

    if (errorMsgs.length > 0) {
        helper.log('Service Kategorie: Update not possible, data missing')
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)))
        return
    }

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var result = kategorieDao.update(request.body.id, request.body.name, request.body.beschreibung, request.body.bildpfad)
        helper.log('Service Kategorie: Record updated, id=' + request.body.id)
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Kategorie: Error updating record by id. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }    
});

serviceRouter.delete('/kategorie/:id', function(request, response) {
    helper.log('Service Kategorie: Client requested deletion of record, id=' + request.params.id)

    const kategorieDao = new KategorieDao(request.app.locals.dbConnection)
    try {
        var obj = kategorieDao.getById(request.params.id)
        kategorieDao.delete(request.params.id)
        helper.log('Service Kategorie: Deletion of record successfull, id=' + request.params.id)
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }))
    } catch (ex) {
        helper.logError('Service Kategorie: Error deleting record. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

module.exports = serviceRouter