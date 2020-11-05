const express = require('express');

const app = express()
const http = require('http');

app.set('port', 3000);

const server = http.createServer(app);
server.listen(3000);

app.use('/', express.static('public'))

module.exports = app;