const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getProfile(_, {username}){
        const user = await User.findOne({username})
        if(!user || !user.verified) {
            throw new ApolloError('User does not exist');
        }else{
            return user
        }
    }
}