const express = require('express');

const app = express()
const http = require('http');

const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/', express.static('public'))

module.exports = app;