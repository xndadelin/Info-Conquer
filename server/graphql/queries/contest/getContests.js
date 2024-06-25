const Contest = require('../../../models/contest')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getContests(_, {}, context){
        try{
            const contests = await Contest.find({}).select("-problems")
            return contests
        }catch(e){
            throw new ApolloError(e)
        }
    }
}