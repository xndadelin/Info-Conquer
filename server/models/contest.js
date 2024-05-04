const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Object,
        required: true
    },
    endDate: {
        type: Object,
        required: true
    },
    problems: {
        type: Array,
        required: true
    },
    languages: {
        type: Array,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    },
}, {timestamps: true})
module.exports = new mongoose.model('contest', contestSchema)