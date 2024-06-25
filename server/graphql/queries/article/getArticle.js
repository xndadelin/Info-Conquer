const Article = require('../../../models/article')
const {ApolloError} = require('apollo-server-express')

module.exports = {
    async getArticle(_, {id}, context){
        try{
            const user = await getUser(context);
            const article = await Article.findOne({_id: id})
            if(user){
                article.hasLiked = article.likes.includes(user.username)
                article.hasDisliked = article.dislikes.includes(user.username)
            }
            return article
        }
        catch(e){
            throw new ApolloError(e)
        }
    }
}