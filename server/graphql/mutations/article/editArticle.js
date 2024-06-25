const Article = require('../../../models/article')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async editArticle(_, {id, title, content, tags}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to edit an article')
        }
        if(!user.admin){
            throw new ApolloError('You have to be an admin in order to edit an article')
        }
        if(!id) throw new ApolloError('This article does not exist')
        const article = await Article.findOne({_id: id})
        if(!article){
            throw new ApolloError('This article does not exist')
        }
        if(title) article.title = title
        if(content) article.content = content
        if(tags) article.tags = tags
        await article.save()
        return {
            success: true
        }
    }
}