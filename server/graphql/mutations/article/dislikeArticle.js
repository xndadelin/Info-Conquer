const Article = require('../../../models/article')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async dislikeArticle(_, {id}, context){
        if(!id) throw new ApolloError('This article does not exist')
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to dislike an article')
        }
        const article = await Article.findOne({_id: id})
        if(!article){
            throw new ApolloError('This article does not exist')
        }
        if(article.dislikes.includes(user.username)){
            return {
                success: false
            }
        }else{
            article.likes = article.likes.filter(like => like !== user.username)
            article.dislikes.push(user.username)
            const usera = await User.findOne({username: user.username})
            usera.activity.push({date: new Date(), message: `${user.username} has disliked the ${article.title} article.`})
            await usera.save()
            await article.save()
            return {
                success: true
            }
        }
    }
}