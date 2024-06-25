const Announcement = require('../../../models/announcements')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getAnnouncement(_, {title}){
        const announcement = await Announcement.findOne({title})
        if(!announcement) throw new ApolloError('This announcement does not exist')
        return announcement
    }
}