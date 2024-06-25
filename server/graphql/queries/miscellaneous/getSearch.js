const User = require('../../../models/user')
const Problem = require('../../../models/problem')
const Article = require('../../../models/article')
const Contest = require('../../../models/contest')
const Announcement = require('../../../models/announcements')
module.exports = {
    async getSearch(_, {query}){
        let users = await User.find({username: { $regex: query, $options: 'i'}}).select('username')
        users = users.map(user => user.username)
        let problems = await Problem.find({title: { $regex: query, $options: 'i'}}).select('title')
        problems = problems.map(problem => problem.title)
        let articles = await Article.find({id: { $regex: query, $options: 'i'}}).select('title')
        articles = articles.map(article => article.title)
        let contests = await Contest.find({title: { $regex: query, $options: 'i'}}).select('name')
        contests = contests.map(contest => contest.name)
        let announcements = await Announcement.find({title: { $regex: query, $options: 'i'}}).select('title')
        announcements = announcements.map(announcement => announcement.title)
        const totalResults = users.length + problems.length + articles.length + contests.length + announcements.length
        return {
            users,
            problems,
            articles,
            contests,
            totalResults
        }
    }
}