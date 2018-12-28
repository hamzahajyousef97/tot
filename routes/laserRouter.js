const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Lasers = require('../models/lasers');
const laserRouter = express.Router();
laserRouter.use(bodyParser.json());

const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/lasers');
    },

    filename: (req, file, cb) => {
        cb(null, Math.random() + file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter});


laserRouter.route('/upload')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file.filename);
});


laserRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Lasers.find(req.query)
    .then((laser) => {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(laser);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Lasers.create(req.body)
    .then((laser) => {
        console.log('Laser created', laser);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(laser);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supporter on /Laser');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Lasers.remove({})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


laserRouter.route('/:laserId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Lasers.findById(req.params.laserId)
    .then((laser) => {
        console.log('Laser created', laser);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(laser);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Laser/'+ req.params.laserId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Lasers.findByIdAndUpdate(req.params.laserId, {
        $set: req.body
    }, { new: true})
    .then((Laser) => {
        console.log('Laser created', Laser);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Laser);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Lasers.findByIdAndRemove(req.params.laserId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = laserRouter;

