const Announcement = require('../../../models/announcements')
const {ApolloError} = require('apollo-server-express')

module.exports = {
    async getAnnouncements(_, {}){
        const announcements = (await Announcement.find({}).sort({createdAt: -1})).slice(0, 5)
        return announcements
    } 
}