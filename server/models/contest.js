const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    problems: {
        type: Array,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    participants: [{
        username: String,
        score: Number,
        problems: [{
            id: String,
            score: Number,
        }]
    }],
    started: {
        type: Boolean,
        default: false
    },
    ended: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Contest', contestSchema)