const Article = require('../../../models/article')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async publishArticle(_, {title, content, tags}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to publish an article')
        }
        if(!user.admin){
            throw new ApolloError('You have to be an admin in order to publish an article')
        }
        if(!title || !content || !tags){
            throw new ApolloError('You have to fill all the fields')
        }
        content = DOMPurify.sanitize(content);
        try{
            const exists = await Article.findOne({title})
            if(exists){
                throw new ApolloError('An article with this title already exists')
            }
            const newArticle = new Article({title, content, tags, creator: user.username, liked: [], disliked: []})
            await newArticle.save()
            return {
                success: true
            }
        }catch(e){
            throw new ApolloError(e)
        }
    }
}