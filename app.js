require('./global_functions');

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const volleyball = require('volleyball');
const models = require('./models');
// const path = require('path');
// const multer = require('multer');

// models.sequelize.sync({'force': true});
const routes = require('./routes/routers');

// middleware for logging
app.use(volleyball);
// middleware for parsing
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({'extended': true}));

app.use('/', routes);

//default route
app.use('*', (req, res, next) => {
    res.send('default route');
});

const server = app.listen( 3000, () => {
    console.log('Operating and listening on port', server.address().port);
});
