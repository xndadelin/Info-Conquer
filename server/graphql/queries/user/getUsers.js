const {ApolloError} = require('apollo-server-express')
const User = require('../../../models/user');
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getUsers(){
        try{
            return await User.find({}).sort({createdAt: -1})
        }catch(err){
            throw new ApolloError(err);
        }
    },
    async getUser(_, {}, context){
        return getUser(context)
    }
}