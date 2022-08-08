require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const client = require('./db/client');
const morgan = require('morgan');
const  apiRouter  = require('./api/index');


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'));
app.use(cors());
app.use('/api', apiRouter);

app.use((error, req, res, next) => {
    if (res.statusCode < 400) res.status(500);
    res.send({
        error: error.message,
        name: error.name,
        message: error.message,
        table: error.table,
    });
});

module.exports = app;
