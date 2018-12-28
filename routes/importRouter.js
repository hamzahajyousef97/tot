const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Imports = require('../models/imports');
const importsRouter = express.Router();
importsRouter.use(bodyParser.json());

const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/imports');
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


importsRouter.route('/upload')
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


importsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Imports.find(req.query)
    .then((imp) => {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(imp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Imports.create(req.body)
    .then((imp) => {
        console.log('import created', imp);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(imp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supporter on /import');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Imports.remove({})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


importsRouter.route('/:importId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Imports.findById(req.params.importId)
    .then((imp) => {
        console.log('import created', imp);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(imp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /import/'+ req.params.importId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Imports.findByIdAndUpdate(req.params.importId, {
        $set: req.body
    }, { new: true})
    .then((Import) => {
        console.log('Import created', Import);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Import);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Imports.findByIdAndRemove(req.params.importId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = importsRouter;

