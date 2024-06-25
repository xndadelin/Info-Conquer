const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getSubmissions(_, {title}, context){
        if(!title){
            throw new ApolloError('The title is null')
        }
        const solutions = await User.aggregate([
            {
                $unwind: "$solutions"
            },
            {
                $match: {
                    "solutions.problem": title
                }
            },
            {
                $project: {
                    _id: 0, 
                    username: 1, 
                    problem: "$solutions.problem", 
                    language: "$solutions.language", 
                    score: "$solutions.score",
                    date: "$solutions.date",
                    compilationError: { $toString: "$solutions.compilationError" } 
                }
            }
        ]);
        return solutions
    }
}