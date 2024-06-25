const Contest = require('../../../models/contest')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')

module.exports = {
    async createContest(_, {name, description, startDate, endDate, problems, languages}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to create a contest')
        }
        if(!user.admin){
            throw new ApolloError('You have to be an admin in order to create a contest')
        }
        if(!name || !description || !startDate || !endDate || !problems){
            throw new ApolloError('You have to fill all the fields')
        }
        const newContest = new Contest({name, description, startDate, endDate, problems, languages, createdBy: user.username})
        await newContest.save()
        return {
            success: true
        }
    }
}