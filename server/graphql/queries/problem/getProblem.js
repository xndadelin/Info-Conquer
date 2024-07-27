const { ApolloError } = require('apollo-server-express')
const Problem = require('../../../models/problem')
const Contest = require('../../../models/contest')
const Daily = require('../../../models/daily')
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getProblem(_, { title, contest, daily }, context) {
        const user = await getUser(context);
        const problem = await Problem.findOne({ title })
        if (!problem) {
            throw new ApolloError('This problem does not exist')
        }
        if (problem.acceptedSolutions + problem.rejectedSolutions === 0) {
            problem.successRate = 0
            await problem.save()
        } else {
            const successRate = problem.acceptedSolutions / (problem.acceptedSolutions + problem.rejectedSolutions) * 100
            problem.successRate = successRate
            await problem.save()
        }
        if (user) {
            problem.userHasRated = problem.ratings.some(rating => rating.username === user.username)
        }
        const contesta = await Contest.findOne({ _id: contest });
        if (contesta) {
            if (!user) {
                return null
            }
            if (!contesta) {
                return problem
            }
            const now = new Date();
            if (contesta) {
                const participantExists = contesta.participants.some(participant => participant.username === user.username);
                if (!participantExists) {
                    return null
                }
                if (contesta.startDate > now) return null
            }
        }
        if (daily) {
            const Problema = await Daily.findOne({ date: daily })
            if (!Problema) return null
            const dailyProblem = await Problem.findOne({ title: Problema.problem })
            if (user) {
                dailyProblem.userHasRated = problem.ratings.some(rating => rating.username === user.username)
            }
        }
        return problem
    }
}