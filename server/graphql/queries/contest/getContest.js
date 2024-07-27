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
        contest.participants.sort((a, b) => b.score - a.score)
        const participates = user && contest.participants.find((participant) => participant.username === user.username)
        
        await Promise.all(contest.problems.map(async (problem, index) => {
            const problemData = await Problem.findOne({title: problem})
            if (problemData) {
                contest.problems[index] = {
                    id: problemData.title,
                    category: problemData.category,
                    difficulty: problemData.difficulty,
                    subcategories: problemData.subcategories
                }
            }
        }))


        if(participates){
            if(!contest.started && !contest.ended){
                contest.problems = []
                return contest  
            }
            if(contest.started){
                return contest
            }
        }else {
            if(!contest.started && !contest.ended){
                contest.problems = []
                return contest  
            }
            if(contest.started && !contest.ended){
                contest.problems = [];
                return contest
            }
            if(contest.ended){
                return contest
            }
        }
    }
}