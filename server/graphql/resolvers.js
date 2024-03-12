const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {ApolloError} = require('apollo-server-express')
const cookie = require('cookie');
const Problem = require('../models/problem');
const {graderCPP} = require('../utils/graders/graderCPP')
const Forum = require("../models/forumpost");
const Article = require('../models/article');
const generateToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET, { expiresIn: '1h' });
};
  
const generateRefreshToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET_REFRESH, { expiresIn: '24h' });
};
const getUser = async(context) => {
    try{
        const cookies =  cookie.parse(context.req.headers.cookie) || ''
        if(!cookies) return null;
        const token = cookies.token;
        const refreshtoken = cookies.refreshToken
        if(!token && !refreshtoken){
            return null;
        }
        const verified = jwt.verify(token, process.env.SECRET);
        if(verified.username){
            const username = verified.username
            const user = await User.findOne({username})
            return user;
        }else{
                const refreshVerified = jwt.verify(refreshtoken, process.env.SECRET_REFRESH);
                    if(refreshVerified){
                    const newToken = generateToken(refreshVerified)
                    const newRefreshToken = generateRefreshToken(refreshVerified)
                    context.res.cookie('token', newToken, {
                        httpOnly: true, 
                        secure: true
                    })
                    context.res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true, 
                        secure: true
                    })
                    const refreshedUser = await User.findOne({username: refreshVerified.username})
                    return refreshedUser
                }
        }
        return null
    }catch(err){
        if (err.name === 'TokenExpiredError') {
                const refreshtoken =  cookie.parse(context.req.headers.cookie).refreshToken
                const refreshVerified =  jwt.verify(refreshtoken, process.env.SECRET_REFRESH);
                if (refreshVerified) {
                   try{
                        const newToken = generateToken(refreshVerified);
                        const newRefreshToken = generateRefreshToken(refreshVerified);

                        context.res.cookie('token', newToken, {
                            httpOnly: true,
                            sameSite: 'strict',
                            secure: true,
                        });

                        context.res.cookie('refreshToken', newRefreshToken, {
                            httpOnly: true,
                            sameSite: 'strict',
                            secure: true,
                        });
                        const refreshedUser = await User.findOne({username: refreshVerified.username})
                        return refreshedUser
                   }catch(err){
                     return null;
                   }
                }
        }
        return null;
    }
}
module.exports = {
    Query: {
        async getUsers(){
            try{
                return await User.find({}).sort({createdAt: -1})
            }catch(err){
                throw new ApolloError(err);
            }
        },
        async getUser(_, {}, context){
            return getUser(context)
        },
        async getProblem(_, {title}, context){
            try{
                const problem = await Problem.findOne({title})
                return problem
            }catch(error){
                throw new ApolloError(error)
            }
        },
        async getProfile(_, {username}){
            try{
                const user = await User.findOne({username})
                if(!user) {
                    throw new ApolloError('User does not exist');
                }else{
                    return {
                        ...user._doc,
                    };
                }
            }catch(error){
                throw new ApolloError(error)
            }
        },
        async getSolution(_, {id}, context) {
            const solution = await User.findOne({"solutions.id_solution": id}, {"solutions.$": 1});
            return solution.solutions[0]
        },
        async getProblems(_, {category, subcategory}) {
            const query = {};
            if (category) {
                query.category = category;
            }
            if (subcategory) {
                query.subcategories = { $in: [subcategory] };
            }
            const problems = await Problem.find(query)
            return problems;
        },
        async getForumPosts(_, {}, context){
            try{
                const forumPosts = await Forum.find({});
                return forumPosts;
            }catch (error){
                throw ApolloError(error)
            }
        },
        async getForumPost(_, {id}, context){
            try{
                const forumPost = await Forum.findOne({_id: id});
                if(!forumPost){
                    throw new ApolloError('This forum post does not exist')
                }
                const user = await getUser(context);
                if(user){
                    if(forumPost.likes.includes(user.username)){
                        forumPost.hasLiked = true
                    }else{
                        forumPost.hasLiked = false
                    }
                }
                if(user){
                    if(forumPost.dislikes.includes(user.username)){
                        forumPost.hasDisliked = true
                    }else{
                        forumPost.hasDisliked = false
                    }
                }
                return forumPost
            }catch (e){
                throw new ApolloError(e)
            }
        },
        async getSubmissions(_, {title}, context){
            try{
                if(!title){
                    throw new ApolloError('The title is null')
                }
                //optimize this
                const users = await User.find({})
                const solutions = []
                users.forEach(user => {
                    user.solutions.forEach(solution => {
                        if(solution.problem === title){
                            solutions.push({
                                username: user.username,
                                problem: solution.problem,
                                language: solution.language,
                                score: solution.score,
                                date: solution.date,
                                compilationError: solution.compilationError
                            })
                        }
                    })
                })
                return solutions
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getArticles(_, {}, context){
            try{
                const articles = await Article.find({})
                return articles
            }catch(e){
                throw new ApolloError(e)
            }
        },
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
        },
        async getTop10Submissions(_, {id}, context){
            try{
                const problem = await Problem.findOne({title: id})
                if(!problem){
                    throw new ApolloError('This problem does not exist')
                }
                const solutions = await User.aggregate([
                    {
                      $unwind: "$solutions"
                    },
                    {
                      $match: {
                        "solutions.problem": id,
                      }
                    },
                    {
                      $project: {
                        username: "$username",
                        date: "$solutions.date",
                        id_solution: "$solutions.id_solution",
                        language: "$solutions.language",
                        score: "$solutions.score",
                        maxMemory: "$solutions.maxMemory",
                        maxExecutionTime: "$solutions.maxExecutionTime"
                      }
                    }
                ]);                  
                solutions.sort((a, b) => (a.maxExecutionTime < b.maxMemory) ? 1 : -1)
                return solutions.slice(0, 20)
            }catch(e){
                throw new ApolloError(e)
            }
        }
    },
    Mutation: {
        async register(_, { registerInput: { username, email, password}}, context){
            try{
                const user = await User.findOne({ $or : [{ username }, { email }]})
                if(user){
                    throw new ApolloError('An account is already linked with these credentials. Please change the credentials to continue registering.');
                }else{
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    const newUser = new User({
                        username,
                        email,
                        password: hashedPassword,
                        admin: false
                    })
                    const user = await newUser.save()
                    const token = generateToken(user)
                        const refreshToken = generateRefreshToken(user);
                        context.res.cookie('token', token, {
                            httpOnly: true, 
                            secure: true,
                            sameSite: 'None'
                        })
                        context.res.cookie('refreshToken', refreshToken, {
                            httpOnly: true, 
                            secure: true,
                            sameSite: 'None'
                        })
                        return {
                            success: true, 
                        }
                }
            }catch(err){
                throw new ApolloError(err)
            }
        },
        async login(_, {loginInput: {query, password}}, context){
            try{
                const user = await User.findOne({ $or : [{ username: query }, { email: query }]})
                if(user){
                    const matchPassword = await bcrypt.compare(password, user.password)
                    if(!matchPassword){
                        throw new ApolloError('Invalid credentials. Please submit again with the correct credentials.');
                    }else{
                        const token = generateToken(user)
                        const refreshToken = generateRefreshToken(user);
                        context.res.cookie('token', token, {
                            httpOnly: true, 
                            secure: true,
                            sameSite: 'None'
                        })
                        context.res.cookie('refreshToken', refreshToken, {
                            httpOnly: true, 
                            secure: true,
                            sameSite: 'None'
                        })
                        return {
                            success: true, 
                        }
                    }
                }else{
                    throw new ApolloError('Invalid credentials. Please submit again with the correct credentials.');
                }
            }catch(err){
                throw new ApolloError(err)
            }
        },
        async logout(_, {}, context){
            context.res.clearCookie('token', { httpOnly: true, secure: true });
            context.res.clearCookie('refreshToken', { httpOnly: true, secure: true });
            return {
                success: true
            }
        },
        async createProblem(_, {problemInput: {title, description, requirements, type, tags, difficulty, category, subcategories, input, output, tests, timeExecution, limitMemory, examples, indications, languages, restriction}}, context){
            try{
                const problemsExists = await Problem.findOne({title});
                const creator = await getUser(context)
                if(problemsExists){
                    throw new ApolloError('Problem exists')
                }else{
                    const problem =  new Problem({creator: creator.username, title, description, requirements, type, tags, difficulty, category, subcategories, input, output, tests, timeExecution, limitMemory, examples, indications, languages, restriction})
                    await problem.save()
                    return {
                        success: true
                    }
                }
            }catch(error){
                console.log(error)
                throw new ApolloError(error)
            }
        },
        async submitSolution(_, {solutionInput: {problem, code, language}}, context){
            try{
                const problema = await Problem.findOne({title: problem}).select('tests title type')
                if(!problem){
                    throw new ApolloError('This problem does not exist.')
                }
                const user = await getUser(context)
                if(!user){
                    throw new ApolloError('You have to be logged in order to submit a solution');
                }
                const testResults = graderCPP(problema.tests, code, problema.title, user.username, problema.type, language);
                user.solutions.push(testResults)
                if(testResults.score === 100)
                    if(!user.solvedProblems.includes(problema.title))
                        user.solvedProblems.push(problema.title);
                await user.save();
                return testResults
            }catch(error){
                throw new ApolloError(error)
            }
        },
        async forumPost(_, {category, content, title}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to post!');
            }
            try{
                if(!category || !title || !content)
                    return {
                        error: {
                            message: 'You have to fill all the fields!'
                        }
                    }
                const forumPost = new Forum({creator: user.username, content, category, replies: [], title, likes: [], dislikes: []})
                await forumPost.save()
            }catch (e){
                return {
                    error: {
                        message: 'You have to fill all the fields!'
                    }
                }
            }
        },
        async postForumReply(_, {content, id}, context){
            try{
                if(!content || !id){
                    throw new ApolloError('You have to fill all the fields or the forum post does not exist anymore.')
                }else{
                    const forumPost = await Forum.findOne({_id: id});
                    if(!forumPost){
                        throw new ApolloError('This forum post does not exist')
                    }else{
                        const user = await getUser(context);
                        if(!user){
                            throw new ApolloError('You have to be looged in order to reply to a forum post');
                        }else {
                            forumPost.replies.push({creator: user.username, content, likes: 0, dislikes: 0, createdAt: new Date() })
                            await forumPost.save();
                        }
                    }
                }
            }catch(error){
                throw new ApolloError(error)
            }
        },
        async likeForumPost(_, {id}, context){
            try{
                if(!id) throw new ApolloError('The id is required')
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You have to be logged in order to like a forum post')
                }
                const forumPost = await Forum.findOne({_id: id});
                if(!forumPost){
                    throw new ApolloError('This forum post does not exist')
                }
                if(forumPost.likes && forumPost.likes.includes(user.username)){
                    return {
                        success: false
                    }
                }else{
                    forumPost.dislikes = forumPost.dislikes.filter(like => like !== user.username)
                    forumPost.likes.push(user.username)
                    await forumPost.save()
                    return {
                        success: true
                    }
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async dislikeForumPost(_, {id}, context){
            try{
                if(!id) throw new ApolloError('The id is required')
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You have to be logged in order to dislike a forum post')
                }
                const forumPost = await Forum.findOne({_id: id});
                if(!forumPost){
                    throw new ApolloError('This forum post does not exist')
                }
                if(forumPost.dislikes && forumPost.dislikes.includes(user.username)){
                    return {
                        success: false
                    }
                }else{
                    forumPost.likes = forumPost.likes.filter(like => like !== user.username)
                    forumPost.dislikes.push(user.username)
                    await forumPost.save()
                    return {
                        success: true
                    }
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
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
            try{
                const exists = await Article.findOne({title})
                if(exists){
                    throw new ApolloError('An article with this title already exists')
                }
                const newArticle = new Article({title, content, tags, creator: user.username, liked: [], disliked: []})
                await newArticle.save()
            }catch(e){
                throw new ApolloError(e)
            }
        },
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
                await article.save()
                return {
                    success: true
                }
            }
        },
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
                await article.save()
                return {
                    success: true
                }
            }
        }
    }
}