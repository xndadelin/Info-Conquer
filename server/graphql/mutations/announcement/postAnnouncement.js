const Announcement = require('../../../models/announcements')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async postAnnouncement(_, {title, content}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to post an announcement')
        }
        if(!user.admin){
            throw new ApolloError('You have to be an admin in order to post an announcement')
        }
        if(!title || !content){
            throw new ApolloError('You have to fill all the fields')
        }
        const exists = await Announcement.findOne({title})
        if(exists){
            throw new ApolloError('An announcement with this title already exists')
        }else{
            const newAnnouncement = new Announcement({title, content, createdBy: user.username})
            await newAnnouncement.save()
        }
        return {
            success: true
        }
    }
}