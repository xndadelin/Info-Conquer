const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    creator: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    requirements: {
        type: String,
        required: true,
    },
    tags: {
        type: Array
    },
    category: {
        type: String,
        required: true
    },
    subcategories: {
        required: true,
        type: Array
    },
    input: {
        type: String
    },
    output: {
        type: String
    },
    tests: {
        type: Array,
        required: true,
        validate: {
          validator: function(v) {
            return v.length > 0;
          },
          message: 'You need at least one test case'
        }
    },      
    timeExecution: {
        type: String,
        required: true
    },
    limitMemory: {
        type: String, 
        required: true
    },
    examples: {
        type: Array
    },
    indications: {
        type: String
    },
    languages: {
        type: Array,
        required: true,
        validate: {
            validator: function(v){
                return v.length > 0
            },
            message: 'You need at least one language.'
        }
    },
    difficulty: {
        type: String,
        required: true
    },
    restriction: {
        type: String,
    },
    itsForContest: {
        type: Boolean,
        required: true
    },
    rejectedSolutions: {
        type: Number,
        default: 0
    },
    acceptedSolutions: {
        type: Number,
        default: 0
    },
    successRate: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('problem', problemSchema)