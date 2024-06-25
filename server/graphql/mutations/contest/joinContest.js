const Contest = require('../../../models/contest')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async joinContest(_, {id}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to join a contest')
        }
        const contest = await Contest.findOne({_id: id})
        if(!contest){
            throw new ApolloError('This contest does not exist')
        }
        const participantExists = contest.participants.some(participant => participant.username === user.username);
        if(participantExists){
            return {
                success: false
            }
        }else{
            contest.participants.push({username: user.username, score: 0, problems: []})
            user.activity.push({date: new Date(), message: `${user.username} has registered for the ${contest.name} contest`})
            await contest.save()
            await user.save()
            return {
                success: true
            }
        }
    }
}