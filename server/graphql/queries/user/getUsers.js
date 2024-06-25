const {ApolloError} = require('apollo-server-express')
const User = require('../../../models/user');
const { getUser } = require('../../../utils/getUser')
module.exports = {
    async getUsers(){
        return await User.find({}).sort({createdAt: -1})
    },
}