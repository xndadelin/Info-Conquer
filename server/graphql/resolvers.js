const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {ApolloError} = require('apollo-server-express')
const cookie = require('cookie');
const Problem = require('../models/problem');
const {graderCPP} = require('../utils/graders/graderCPP')
const Article = require('../models/article');
const Announcement = require('../models/announcements');
const Contest = require('../models/contest');
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
                const user = await getUser(context);
                const problem = await Problem.findOne({title})
                if(problem.itsForContest){
                    const contest = await Contest.findOne({ "problems.id": problem.title });
                    if(!contest){
                        return problem
                    }
                    const now = new Date();
                    const startDate = new Date(contest.startDate.year, contest.startDate.month - 1, contest.startDate.day, contest.startDate.hour, contest.startDate.minute)
                    const endDate = new Date(contest.endDate.year, contest.endDate.month - 1, contest.endDate.day, contest.endDate.hour, contest.endDate.minute)
                    if(contest){
                        const participantExists = contest.participants.some(participant => participant.username === user.username);
                        if(!participantExists){
                            return null
                        }
                        if(startDate >  now) return null
                    }
                }
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
                    console.log(user)
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
        async getSubmissions(_, {title}, context){
            try{
                if(!title){
                    throw new ApolloError('The title is null')
                }
                //mongo db aggregation later better
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
                                compilationError: JSON.stringify(solution.compilationError),
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
        async getProblemStats(_, {id}, context){
            try{
                const problem = await Problem.findOne({title: id})
                if(!problem){
                    throw new ApolloError('This problem does not exist')
                }
                const firstsolves = await User.aggregate([
                    {
                      $unwind: "$solutions"
                    },
                    {
                      $match: {
                        "solutions.problem": id,
                        "solutions.score": 100
                      }
                    },
                    {
                      $project: {
                        username: "$username",
                        date: "$solutions.date",
                        language: "$solutions.language",
                      }
                    },
                    {
                        $group: {
                            _id: "$username", 
                            date: { $first: "$date" }, 
                            language: { $first: "$language" }
                        }
                    },
                    {
                      $sort: {
                        date: 1
                      }
                    },
                    {
                        $limit: 3
                    } 
                ]);   
                const bestTimeExecutions = await User.aggregate([
                    {
                        $unwind: "$solutions"
                    },
                    {
                        $match: {
                            'solutions.problem': id,
                            'solutions.score': 100
                        },
                    },
                    {
                        $project: {
                            username: "$username",
                            date: "$solutions.date",
                            language: "$solutions.language",
                            timeExecutions: {
                                $map: {
                                    input: "$solutions.tests",
                                    as: "test",
                                    in: "$$test.executionTime"
                                }
                            }
                        }
                    }, 
                    {
                        $limit: 10
                    },
                ])
                bestTimeExecutions.forEach(solution => {
                    solution.timeExecutions = solution.timeExecutions.reduce((a, b) => a + b, 0) / solution.timeExecutions.length
                })
                bestTimeExecutions.sort((a, b) => a.timeExecutions - b.timeExecutions)
                const bestMemory = await User.aggregate([
                    {
                        $unwind: "$solutions"
                    },
                    {
                        $match: {
                            'solutions.problem': id,
                            'solutions.score': 100
                        },
                    },
                    {
                        $project: {
                            username: "$username",
                            date: "$solutions.date",
                            language: "$solutions.language",
                            memory: {
                                $map: {
                                    input: "$solutions.tests",
                                    as: "test",
                                    in: "$$test.memoryUsed"
                                }
                            }
                        }
                    }, 
                    {
                        $limit: 10
                    },
                ])
                bestMemory.forEach(solution => {
                    solution.memory = solution.memory.reduce((a, b) => a + b, 0) / solution.memory.length
                })
                bestMemory.sort((a, b) => a.memory - b.memory)
                const dates = [];
                const today = new Date();
                dates.push(new Date(today));
                
                for (let i = 1; i <= 6; i++) {
                    const newDate = new Date(today);
                    newDate.setDate(today.getDate() - i);
                    newDate.setHours(0, 0, 0, 0);
                    dates.push(newDate);
                }
                const solvesPerDay = await Promise.all(dates.map(async (date, index) => {
                    const solves = await User.aggregate([
                        { $unwind: "$solvedProblems" },
                        { $match: { 'solvedProblems.problem': id, 'solvedProblems.date': { $lt: new Date(date)} } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]);
                
                    return { date: date, count: solves.length > 0 ? solves[0].count : 0 };
                }));
                return {
                    firstSubmissions: firstsolves,
                    timeExecution: bestTimeExecutions,
                    bestMemory: bestMemory,
                    solves: solvesPerDay
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getAnnouncement(_, {title}){
            try{
                const announcement = await Announcement.findOne({title})
                if(!announcement) throw new ApolloError('This announcement does not exist')
                return announcement
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getAnnouncements(_, {}){
            try{
                const announcements = (await Announcement.find({}).sort({createdAt: -1})).slice(0, 5)
                return announcements
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getContests(_, {}, context){
            try{
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You are not logged in')
                }
                const contests = await Contest.find({}).select("-problems")
                return contests
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getContest(_, {id}, context){
            try{
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You are not logged in')
                }   
                const contest = await Contest.findOne({_id: id})
                if(!contest){
                    throw new ApolloError('This contest does not exist')
                }
                const now = new Date();
                const startDate = new Date(contest.startDate.year, contest.startDate.month - 1, contest.startDate.day, contest.startDate.hour, contest.startDate.minute)
                const endDate = new Date(contest.endDate.year, contest.endDate.month - 1, contest.endDate.day, contest.endDate.hour, contest.endDate.minute)
                if(now > startDate && now < endDate){
                    contest.hasStarted = true
                    return contest
                }else if(now < startDate){
                    contest.hasStarted = false
                    contest.problems = []
                    return contest
                }else if(now > endDate){
                    contest.hasStarted = false
                    contest.hasEnded = true    
                    return contest               
                }
            }catch(e){
                throw new ApolloError(e)
            }
        }
    },
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword}}, context){
            try{
                const user = await User.findOne({ $or : [{ username }, { email }]})
                if(user){
                    throw new ApolloError('An account is already linked with these credentials. Please change the credentials to continue registering.');
                }else{
                    if(username.length < 4){
                        throw new ApolloError('Username must be at least 4 characters long');
                    }
                    const email_okey = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                    if(password !== confirmPassword){
                        throw new ApolloError('Passwords do not match. Please submit again with matching passwords.');
                    }
                    if(!email_okey.test(email)){
                        throw new ApolloError('Invalid email. Please submit again with a valid email.');
                    }
                    const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g
                    if(!strongPassword.test(password)){
                        throw new ApolloError('Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
                    }
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
                throw new ApolloError(error)
            }
        },
        async submitSolution(_, {solutionInput: {problem, code, language}}, context){
            try{
                const problema = await Problem.findOne({title: problem}).select('tests title type')
                const contest = await Contest.findOne({ "problems.id": problema.title });
                if(!problem){
                    throw new ApolloError('This problem does not exist.')
                }
                const user = await getUser(context)
                if(!user){
                    throw new ApolloError('You have to be logged in order to submit a solution');
                }
                if(contest){
                    const participantExists = contest.participants.some(participant => participant.username === user.username);
                    if(!participantExists){
                        throw new ApolloError('You have to join the contest in order to submit a solution')
                    }
                    const now = new Date();
                    const startDate = new Date(contest.startDate.year, contest.startDate.month - 1, contest.startDate.day, contest.startDate.hour, contest.startDate.minute)
                    const endDate = new Date(contest.endDate.year, contest.endDate.month - 1, contest.endDate.day, contest.endDate.hour, contest.endDate.minute)
                    if(now > endDate){
                        throw new ApolloError('This contest has ended')
                    }
                    if(now < startDate){
                        throw new ApolloError('This contest has not started yet')
                    }
                }
                const testResults = graderCPP(problema.tests, code, problema.title, user.username, problema.type, language);
                user.solutions.push(testResults)
                if(testResults.score === 100)
                    if(!user.solvedProblems.find(solved => solved.problem === problema.title)){
                        user.solvedProblems.push({problem: problema.title, date: new Date()});
                        await user.save();
                    }
                if(contest){
                    //update score
                    const Participant = contest.participants.find(participant => participant.username === user.username);
                    const problemIndex = Participant.problems.findIndex(problem => problem.id === problema.title);
                    if(problemIndex === -1){
                        Participant.problems.push({id: problema.title, score: testResults.score})
                    }
                    else{
                        if(testResults.score > Participant.problems[problemIndex].score){
                            Participant.problems[problemIndex].score = testResults.score
                        }
                    }
                    Participant.score = Participant.problems.reduce((acc, problem) => acc + problem.score, 0)
                    contest.participants = contest.participants.map(participant => participant.username === user.username ? Participant : participant)
                    await contest.save();
                }
                await user.save();
                return testResults
            }catch(error){
                throw new ApolloError(error)
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
        },
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
        },
        async postAnnouncement(_, {title, content}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to post an announcement')
            }
            if(!user.admin){
                throw new ApolloError('You have to be an admin in order to post an announcement')
            }
            if(!title || !content){
                throw new ApolloError('You have to fill all the fields')
            }
            try{
                const exists = await Announcement.findOne({title})
                if(exists){
                    throw new ApolloError('An announcement with this title already exists')
                }else{
                    const newAnnouncement = new Announcement({title, content, createdBy: user.username})
                    await newAnnouncement.save()
                }
                return {
                    success: true
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async createContest(_, {name, description, startDate, endDate, problems, languages}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to create a contest')
            }
            if(!user.admin){
                throw new ApolloError('You have to be an admin in order to create a contest')
            }
            if(!name || !description || !startDate || !endDate || !problems){
                throw new ApolloError('You have to fill all the fields')
            }
            try{
                const newContest = new Contest({name, description, startDate, endDate, problems, languages, createdBy: user.username})
                await newContest.save()
                return {
                    success: true
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async joinContest(_, {id}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to join a contest')
            }
            const contest = await Contest.findOne({_id: id})
            if(!contest){
                throw new ApolloError('This contest does not exist')
            }
/*             const now = new Date();
            const startDate = new Date(contest.startDate.year, contest.startDate.month, contest.startDate.day, contest.startDate.hour, contest.startDate.minute)
            const endDate = new Date(contest.endDate.year, contest.endDate.month, contest.endDate.day, contest.endDate.hour, contest.endDate.minute) */
            const participantExists = contest.participants.some(participant => participant.username === user.username);
            if(participantExists){
                return {
                    success: false
                }
            }else{
                contest.participants.push({username: user.username, score: 0, problems: []})
                await contest.save()
                return {
                    success: true
                }
            }
        }
    }
}