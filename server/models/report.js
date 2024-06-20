const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    reporter : {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    problem: {
        type: String,
    },
})
module.exports = mongoose.model('report', reportSchema);