const Contest = require('../../../models/contest')
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getContests(_, {}, context){
        const user = await getUser(context)
        const contests = await Contest.find({}).select("-problems")
        if(user){
            contests.forEach((contest) => {
                contest.hasJoined = contest.participants.find(participant => participant.username === user.username) ? true : false
            })
        }
        return contests 
    }
}