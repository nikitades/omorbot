const http = require('http');
const https = require('https');
const fs = require('fs');
const core = require('./core');

core.app.use(core.router.routes());

http.createServer(core.app.callback()).listen(80);
const options = {
    key: fs.readFileSync('./ssl/private.pem', 'utf8'),
    cert: fs.readFileSync('./ssl/20180303.crt', 'utf8')
};
https.createServer(options, core.app.callback()).listen(443);