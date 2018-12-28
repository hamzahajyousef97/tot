const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exportSchema = new Schema({
    nameEN: {
        type: String,
        required: true
    },
    nameTR: {
        type: String,
        required: true
    },
    nameAR: {
        type: String,
        required: true
    },
    descriptionEN: {
        type: String,
        required: true
    },
    descriptionTR: {
        type: String,
        required: true
    },
    descriptionAR: {
        type: String,
        required: true
    },
    imageT: {
        type: String,
        required: true
    },
    imageO: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var Exports = mongoose.model('Exports', exportSchema);

module.exports = Exports;