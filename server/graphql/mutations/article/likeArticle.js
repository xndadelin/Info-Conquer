const Article = require('../../../models/article')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async likeArticle(_, {id}, context){
        if(!id) throw new ApolloError('This article does not exist')
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to like an article')
        }
        const article = await Article.findOne({_id: id})
        if(!article){
            throw new ApolloError('This article does not exist')
        }
        if(article.likes.includes(user.username)){
            return {
                success: false
            }
        }else{
            article.dislikes = article.dislikes.filter(dislike => dislike !== user.username)
            article.likes.push(user.username)
            const usera = await User.findOne({username: user.username})
            usera.activity.push({date: new Date(), message: `${user.username} has liked the ${article.title} article.`})
            await user.save()
            await article.save()
            return {
                success: true
            }
        }
    }
}