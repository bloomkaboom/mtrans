require('./global_functions');

const express = require('express');
const bodyParser = require('body-parser');
const volleyball = require('volleyball');
const routes = require('./routers/router');
const models = require('./models');
const app = express();
const db = {};

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(volleyball);
app.use('/', routes)

app.use('*', (req, res, next) => {
    res.send('default route');
});

const server = app.listen(5000, () => {
    console.log('App listening on port', server.address().port);
});