const Article = require('../../../models/article')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getArticles(_, {}, context){
        try{
            const articles = await Article.find({})
            return articles
        }catch(e){
            throw new ApolloError(e)
        }
    }
}