const Report = require('../../../models/report')
const { getUser } = require('../../../utils/getUser')
const Problem = require('../../../models/problem')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async createReport(_, {title, description, reporter, type, problem}, context){
        try{
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in to report a problem')
            }
            if(!title || !description || !reporter || !type){
                throw new ApolloError('You have to fill all the fields')
            }
            if(type === 'problem' && !problem){
                throw new ApolloError('You have to fill all the fields')
            }
            if(type == 'problem'){
                const exists = await Problem.findOne({title: problem})
                if(!exists){
                    throw new ApolloError('This problem does not exist')
                }
                const newReport = new Report({title, description, reporter, type, problem})
                await newReport.save()
            }
            return {
                success: true
            }
        }catch(e){
            throw new ApolloError(e)
        }
    }
}