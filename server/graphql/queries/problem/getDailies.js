const Daily = require('../../../models/daily')
const {ApolloError} = require('apollo-server-express')
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getDailies(_, {}, context) {
        try{
            const user = await getUser(context)
            if(!user) throw new ApolloError('You have to be logged in order to access the dailies!')
            const dailies = await Daily.find({})
            for(const daily of dailies){
                const solved = daily.solvers.includes(user.username)
                daily.solved = solved;
    
            }
            return dailies
        }catch(e){
            throw new ApolloError(e)
        }
    }
}