const http = require('http');
const https = require('https');
const fs = require('fs');
const core = require('./core');
const config = require('./config');

core.app.use(core.router.routes());

const http_server = http.createServer(core.app.callback()).listen(config.http_port);
if (http_server) console.log(`HTTP started at ${config.http_port}`);

const https_server = https.createServer({
    key: fs.readFileSync('./enc/privkey1.pem', 'utf8'),
    cert: fs.readFileSync('./enc/cert1.pem', 'utf8'),
    ca: fs.readFileSync('./enc/fullchain1.pem', 'utf8')
}, core.app.callback()).listen(config.https_port);
if (https_server) console.log(`HTTPS started at ${config.https_port}`);