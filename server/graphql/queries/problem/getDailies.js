const Daily = require('../../../models/daily')
const {ApolloError} = require('apollo-server-express')
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getDailies(_, {}, context) {
        const user = await getUser(context)
        if(!user) return null
        const dailies = await Daily.find({})
        for(const daily of dailies){
            const solved = daily.solvers.includes(user.username)
            daily.solved = solved;

        }
        return dailies
    }
}