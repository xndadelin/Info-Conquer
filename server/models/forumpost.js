const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    replies: {
        type: Array,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    likes: {
        type: Array
    },
    dislikes: {
        type: Array
    }
}, {timestamps: true})
module.exports = mongoose.model('forum', forumSchema);