const Contest = require('../../../models/contest')
const {ApolloError} = require('apollo-server-express')
const { getUser } = require('../../../utils/getUser')
const Problem = require('../../../models/problem')
module.exports = {
    async getContest(_, {id}, context){
        const user = await getUser(context)
        const contest = await Contest.findOne({_id: id})
        if(!contest){
            throw new ApolloError('This contest does not exist')
        }   
        const now = new Date();
        contest.participants.sort((a, b) => b.score - a.score)
        const participates = user ? contest.participants.some((participant) => participant.username === user.username) : false
        await Promise.all(contest.problems.map(async (problem, index) => {
            const problemData = await Problem.findOne({title: problem})
            if (problemData) {
                contest.problems[index] = {
                    ...problem,
                    id: problemData.title,
                    category: problemData.category,
                    difficulty: problemData.difficulty,
                    subcategories: problemData.subcategories
                }
            }
        }))

        if(now > contest.startDate && now < contest.endDate || now > contest.endDate ){
            return contest
        }else if(now < contest.startDate && !participates){
            contest.problems = []
            return contest
        }else if(now < contest.startDate && participates){
            contest.problems = []
            return contest
        }
    }
}