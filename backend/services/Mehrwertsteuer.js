const helper = require('../helper.js')
const MehrwertsteuerDao = require('../dao/MehrwertsteuerDao.js')
const express = require('express')
var serviceRouter = express.Router()

helper.log('- Service Mehrwertsteuer')

serviceRouter.get('/mehrwertsteuer/gib/:id', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested one record, id=' + request.params.id)

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var result = mehrwertsteuerDao.getById(request.params.id)
        helper.log('Service Mehrwertsteuer: Record loaded')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error geting record by id. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
})

serviceRouter.get('/mehrwertsteuer/alle', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested all records')

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var result = mehrwertsteuerDao.getAll()
        helper.log('Service Mehrwertsteuer: Records loaded, count=' + result.length)
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error loading all records. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

serviceRouter.get('/mehrwertsteuer/existiert/:id', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested check, if record exists, id=' + request.params.id)

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var result = mehrwertsteuerDao.exists(request.params.id)
        helper.log('Service Mehrwertsteuer: Check if record exists by id=' + request.params.id + ', result=' + result)
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error checking if record exists. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

serviceRouter.post('/mehrwertsteuer', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested creation of new record');

    var errorMsgs=[]
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt')
    if (helper.isUndefined(request.body.satz)) {
        errorMsgs.push('Satz fehlt')
    } else if (!helper.isNumeric(request.body.satz)) {
        errorMsgs.push('Satz muss eine Zahl sein')
    } else if (request.body.Satz <= 0) {
        errorMsgs.push('Satz muss eine Zahl > 0 sein')
    }        
    
    if (errorMsgs.length > 0) {
        helper.log('Service Mehrwertsteuer: Creation not possible, data missing')
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)))
        return
    }

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var result = mehrwertsteuerDao.create(request.body.name, request.body.satz)
        helper.log('Service Mehrwertsteuer: Record inserted')
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error creating new record. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }    
})

serviceRouter.put('/mehrwertsteuer', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested update of existing record')

    var errorMsgs=[]
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt')
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('Name fehlt')
    if (helper.isUndefined(request.body.satz)) {
        errorMsgs.push('Satz fehlt')
    } else if (!helper.isNumeric(request.body.satz)) {
        errorMsgs.push('Satz muss eine Zahl sein')
    } else if (request.body.satz <= 0) {
        errorMsgs.push('Satz muss eine Zahl > 0 sein')
    }

    if (errorMsgs.length > 0) {
        helper.log('Service Mehrwertsteuer: Update not possible, data missing')
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)))
        return
    }

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var result = mehrwertsteuerDao.update(request.body.id, request.body.name, request.body.satz)
        helper.log('Service Mehrwertsteuer: Record updated, id=' + request.body.id)
        response.status(200).json(helper.jsonMsgOK(result))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error updating record by id. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }    
});

serviceRouter.delete('/mehrwertsteuer/:id', function(request, response) {
    helper.log('Service Mehrwertsteuer: Client requested deletion of record, id=' + request.params.id)

    const mehrwertsteuerDao = new MehrwertsteuerDao(request.app.locals.dbConnection)
    try {
        var obj = mehrwertsteuerDao.getById(request.params.id)
        mehrwertsteuerDao.delete(request.params.id)
        helper.log('Service Mehrwertsteuer: Deletion of record successfull, id=' + request.params.id)
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }))
    } catch (ex) {
        helper.logError('Service Mehrwertsteuer: Error deleting record. Exception occured: ' + ex.message)
        response.status(400).json(helper.jsonMsgError(ex.message))
    }
});

module.exports = serviceRouter