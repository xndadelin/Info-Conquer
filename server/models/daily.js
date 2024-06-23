const mongoose = require('mongoose')

const dailySchema = new mongoose.Schema({
    problem : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    solvers: {
        type: Array,
        default: []
    },
    ended: {
        type: Boolean,
        default: false
    }
}, { timestamps : true} )

module.exports = new mongoose.model('daily', dailySchema)