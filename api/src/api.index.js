const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const router = require('./router');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/", require("./routes/index"));
app.use("/", require("./routes/spot"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/userSpots"));

app.listen(config.api.port);

module.exports = app;
