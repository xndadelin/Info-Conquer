const Article = require('../../../models/article')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

module.exports = {
    async publishArticle(_, {title, content, tags, type, excerpt}, context){
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
        if(type === 'publish'){
            const exists = await Article.findOne({title})
            if(exists){
                throw new ApolloError('An article with this title already exists')
            }
            const newArticle = new Article({title, content, tags, excerpt, creator: user.username, liked: [], disliked: []})
            await newArticle.save()
            return {
                success: true
            }
        }else if(type === 'update'){
            const article = await Article.findOne({title})
            if(!article){
                throw new ApolloError('This article does not exist')
            }
            article.content = content
            article.tags = tags
            article.excerpt = excerpt
            await article.save()
            return {
                success: true
            }
        }else{
            throw new ApolloError('Invalid type')
        }
    }
}