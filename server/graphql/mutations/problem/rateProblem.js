const Problem = require('../../../models/problem')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async rateProblem(_, {id, rating}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in to rate a problem')
        }
        const problem = await Problem.findOne({title: id})
        if(!problem){
            throw new ApolloError('This problem does not exist')
        }
        if(rating < 1 || rating > 5){
            throw new ApolloError('Rating must be between 1 and 5')
        }
        if(problem.ratings.find(r => r.username === user.username)){
            throw new ApolloError('You have already rated this problem')
        }
        problem.ratings.push({username: user.username, rating})
        await problem.save()
        user.activity.push({date:new Date(), message: `${user.username} has rated the ${id} problem ${rating} stars`})
        await user.save()
        const allRatings = problem.ratings.reduce((total, current) => total + current.rating, 0)
        const avgRating = allRatings / (problem.ratings ? problem.ratings.length : 1)
        problem.rating = avgRating
        await problem.save()
        return {
            success: true
        }
    }
}