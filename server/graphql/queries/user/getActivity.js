const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getActivity(_, {username}) {
        try{
            const user = await User.findOne({username, verified:true})
            if(!user) {
                throw new ApolloError('This account does not exist!');
            }
            return user.activity
        }catch(e){
            throw new ApolloError(e)
        }
    }
}