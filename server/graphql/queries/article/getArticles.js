const Article = require('../../../models/article')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getArticles(_, {}, context){
        const articles = await Article.find({})
        return articles
    }
}