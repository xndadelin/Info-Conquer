const { getUser } = require('../../../utils/getUser')
const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async verifyEmail(_, {token}, context){
        const user = await getUser(context);
        if(user){
            throw new ApolloError('You are already logged in')
        }
        const user_ = await User.findOne({codeForVerification: token})
        if(!user_){
            throw new ApolloError('This token is invalid')
        }
        user_.verified = true;
        user_.codeForVerification = '';
        await user_.save()
        return {
            success: true
        }
    }
}