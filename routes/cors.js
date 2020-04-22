const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [ 'https://server.tot-tr.com/', 'http://localhost:4200','https://tot-control.firebaseapp.com','https://tot-tr.com/home'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
