// workaround / bugfix for linux systems
Object.fromEntries = l => l.reduce((a, [k,v]) => ({...a, [k]: v}), {})
/////////////////

const helper = require('./helper.js');
helper.log('Starting backend server...');

try {
    // connect database
    helper.log('Connect database...');
    const Database = require('better-sqlite3');
    const dbOptions = { verbose: console.log };
    const dbFile = './db/db.sqlite';
    const dbConnection = new Database(dbFile, dbOptions);

    // create server
    const HTTP_PORT = 8000;
    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    const _ = require('lodash');

    helper.log('Creating and configuring Web Server...');
    const app = express();
    
    // provide service router with database connection / store the database connection in global server environment
    app.locals.dbConnection = dbConnection;

    helper.log('Binding middleware...');
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use(function(request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(morgan('dev'));

    // binding endpoints
    const TOPLEVELPATH = '/webanw2';
    helper.log('Binding endpoints, top level Path at ' + TOPLEVELPATH);
    
    var serviceRouter = require('./services/Kategorie.js');
    app.use(TOPLEVELPATH, serviceRouter);

    serviceRouter = require('./services/Mehrwertsteuer.js');
    app.use(TOPLEVELPATH, serviceRouter);

    serviceRouter = require('./services/Produkt.js');
    app.use(TOPLEVELPATH, serviceRouter);

    serviceRouter = require('./services/Bestellung.js');
    app.use(TOPLEVELPATH, serviceRouter);

    serviceRouter = require('./services/Bewerber.js');
    app.use(TOPLEVELPATH, serviceRouter);

    // send default error message if no matching endpoint found
    app.use(function (request, response) {
        helper.log('Error occured, 404, resource not found');
        response.status(404).json(helper.jsonMsgError('Resource not found'));
    });


    // starting the Web Server
    helper.log('\nBinding Port and starting Webserver...');
    app.listen(HTTP_PORT, () => {
        helper.log('Listening at localhost, port ' + HTTP_PORT);
        helper.log('\n\n-----------------------------------------');
        helper.log('exit / stop Server by pressing 2 x CTRL-C');
        helper.log('-----------------------------------------\n\n');
    });

} catch (ex) {
    helper.logError(ex);
}