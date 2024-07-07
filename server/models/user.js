const {mongoose} = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String, 
        unique: true
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        required: true
    },
    solutions: {
        type: Array,
    },
    solvedProblems:{
        type: Array
    },
    codeForVerification: {
        type: String,
    },
    lastEmailVerification: {
        type: Date,
    },
    discordID: {
        type: String,
    },
    activity: {
        type: Array
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
    },
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)