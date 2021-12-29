const helper = require('./helper.js');
const path = require('path');
helper.log('Starting frontend server...');

try {
    const HTTP_PORT = 8080;
    const express = require('express');
    const app = express()

    app.get('/js/sessionHandling.js',function(req,res){
        res.sendFile(path.join(__dirname + '/js/sessionHandling.js')); 
    });
    app.get('/style.css', (req, res) => {
        res.sendFile(path.join(__dirname, './style.css'))
    })
    app.get('/startseite.html', (req, res) => {
        res.sendFile(path.join(__dirname, './Startseite.html'))
    })
    app.get('/product.html', (req, res) => {
        res.sendFile(path.join(__dirname, './product.html'))
    })
    app.get('/warenkorb.html', (req, res) => {
        res.sendFile(path.join(__dirname, './warenkorb.html'))
    })
    app.get('/bestellformular.html', (req, res) => {
        res.sendFile(path.join(__dirname, './bestellformular.html'))
    })
    app.get('/bestelluebersicht.html', (req, res) => {
        res.sendFile(path.join(__dirname, './bestelluebersicht.html'))
    })
    app.get('/impressum.html', (req, res) => {
        res.sendFile(path.join(__dirname, './impressum.html'))
    })
    app.get('/standort.html', (req, res) => {
        res.sendFile(path.join(__dirname, './standort.html'))
    })
    app.get('/agb.html', (req, res) => {
        res.sendFile(path.join(__dirname, './agb.html'))
    })
    app.get('/bewerbung.html', (req, res) => {
        res.sendFile(path.join(__dirname, './bewerbung.html'))
    })

    app.listen(HTTP_PORT, () => {
        helper.log('Listening at localhost, port ' + HTTP_PORT)
        helper.log('\n\n-----------------------------------------')
        helper.log('exit / stop Server by pressing 2 x CTRL-C')
        helper.log('-----------------------------------------\n\n')
    })
} catch (err) {
    helper.logError(err)
}