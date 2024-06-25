const Contest = require('../../../models/contest')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getContest(_, {id}, context){
        const user = await getUser(context)
        const contest = await Contest.findOne({_id: id})
        if(!contest){
            throw new ApolloError('This contest does not exist')
        }   
        const now = new Date();
        contest.participants.sort((a, b) => b.score - a.score)
        const participates = contest.participants.some((participant) => participant.username === user.username)
        if(now > contest.startDate && now < contest.endDate && participates || now > contest.endDate ){
            return contest
        }else if(now < contest.startDate && !participates){
            contest.problems = []
            return contest
        }
    }
}