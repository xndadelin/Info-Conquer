const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getSubmissions(_, {title}, context){
        const user = await getUser(context)
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
                    status: "$solutions.status"
                }
            }
        ]);
        if(user) {
            const userSolutions = await User.aggregate([
                {
                    $unwind: "$solutions"
                },
                {
                    $match: {
                        "solutions.username": user.username,
                        "solutions.problem": title
                    }
                },
                {
                    $project: {
                        _id: "$solutions.id_solution",
                        username: 1,
                        problem: "$solutions.problem",
                        language: "$solutions.language",
                        score: "$solutions.score",
                        date: "$solutions.date",
                        status: "$solutions.status"
                    }
                }
            ]);
            return {
                allSolutions: solutions,
                userSolutions: userSolutions
            }
        }
        return {
            allSolutions: solutions,
        }
    }
}