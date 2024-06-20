const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {ApolloError} = require('apollo-server-express')
const cookie = require('cookie');
const Problem = require('../models/problem');
const {grader} = require('../utils/graders/grader')
const Article = require('../models/article');
const Announcement = require('../models/announcements');
const Contest = require('../models/contest');
const nodemailer = require('nodemailer');
const openai = require('openai');
const client = new openai(process.env.OPENAI_API_KEY);
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
require('dotenv').config();
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const Report = require('../models/report');
const generateToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET, { expiresIn: '1h' });
};
  
const generateRefreshToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET_REFRESH, { expiresIn: '24h' });
};
const sendEmail = (email, codeForVerification) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mail = {
        from: {
            name: 'InfoConquer',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify your email address for InfoConquer',
        html: `<h1>Verify your email address</h1>
            <p>Click <a href="${process.env.CLIENT_URL}/verify/${codeForVerification}">here</a> to verify your email address</p>
            <p>If you did not register for InfoConquer, please ignore this email</p>
            <p style="color: red;">This link will expire in 24 hours</p>
        `
    }
    transporter.sendMail(mail, (err, info) => {
        if(err){
            throw new ApolloError(err)
        }
    })
}
const validateTurnstile = async(token, req) => {
    const ip = req.ip.split(':').pop()
    let formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

	  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	  const result = await fetch(url, {
		  body: formData,
		  method: 'POST',
	  });
    const data = await result.json();
    return data;
}
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
            const user = await User.findOne({username, verified: true})
            return user;
        }else{
            const refreshVerified = jwt.verify(refreshtoken, process.env.SECRET_REFRESH);
                if(refreshVerified){
                    const newToken = generateToken(refreshVerified)
                    const newRefreshToken = generateRefreshToken(refreshVerified)
                    context.res.cookie('token', newToken, {
                        httpOnly: true, 
                        secure: true,
                        sameSite: 'Strict'
                    })
                    context.res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true, 
                        secure: true,
                        sameSite: 'Strict'
                    })
                    const refreshedUser = await User.findOne({username: refreshVerified.username, verified: true})
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
                        const refreshedUser = await User.findOne({username: refreshVerified.username, verified: true})
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
                if(!problem){
                    throw new ApolloError('This problem does not exist')
                }
                if(problem.acceptedSolutions + problem.rejectedSolutions === 0){
                    problem.successRate = 0
                    await problem.save()
                }else{
                    const successRate = problem.acceptedSolutions / (problem.acceptedSolutions + problem.rejectedSolutions) * 100
                    problem.successRate = successRate
                    await problem.save()    
                }
                const contest = await Contest.findOne({ "problems.id": problem.title });
                if(contest){
                    if(!user){
                        return null
                    }
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
                if(user){
                    problem.userHasRated = problem.ratings.some(rating => rating.username === user.username)
                }
                return problem
            }catch(error){
                throw new ApolloError(error)
            }
        },
        async getProfile(_, {username}){
            try{
                const user = await User.findOne({username})
                if(!user || !user.verified) {
                    throw new ApolloError('User does not exist');
                }else{
                    return user
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
            if (subcategory !== 'none') {
                query.subcategories = { $in: [subcategory] };
            }
            const problems = await Problem.find(query, {itsForContest: false}).select('title category subcategories difficulty tags type');
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
                bestMemory.forEach(solution => {
                    solution.memory = parseFloat(solution.memory.toFixed(2))
                })
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
                contest.participants.sort((a, b) => b.score - a.score)
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
        },
        async getHomepageInfo(_, {}, context){
            try{
                const problems = (await Problem.find({}).sort({acceptedSolutions: -1}).limit(5))
                return {
                    topProblems: problems.map(problem => {
                        return {
                            title: problem.title,
                            difficulty: problem.difficulty,
                            tags: problem.tags,
                            successRate: problem.successRate
                        }
                    })
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getLeaderboard(_, {}, context){
            try{
                const users = await User.aggregate([
                    {
                      $project: {
                        username: 1,
                        solvedProblems: { $size: "$solvedProblems" }
                      }
                    },
                    {
                      $sort: { solvedProblems: -1 }
                    }
                ])
                return users
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async getSearch(_, {query}, context){
            try{
                let users = await User.find({username: { $regex: query, $options: 'i'}}).select('username')
                users = users.map(user => user.username)
                let problems = await Problem.find({title: { $regex: query, $options: 'i'}}).select('title')
                problems = problems.map(problem => problem.title)
                let articles = await Article.find({id: { $regex: query, $options: 'i'}}).select('title')
                articles = articles.map(article => article.title)
                let contests = await Contest.find({title: { $regex: query, $options: 'i'}}).select('name')
                contests = contests.map(contest => contest.name)
                let announcements = await Announcement.find({title: { $regex: query, $options: 'i'}}).select('title')
                announcements = announcements.map(announcement => announcement.title)
                const totalResults = users.length + problems.length + articles.length + contests.length + announcements.length
                return {
                    users,
                    problems,
                    articles,
                    contests,
                    totalResults
                }
            }catch(e){
                throw new ApolloError(e)
            }
        }
    },
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword, token}}, context){
            try{
                const responseTurnstile = await validateTurnstile(token, context.req)
                if(!responseTurnstile.success){
                    throw new ApolloError('Invalid captcha. Please submit again with the correct captcha. If you have any problems with the captcha, please refresh the page and try again or contact us.')
                }
                const user = await User.findOne({ $or : [{ username }, { email }]})
                if(user && user.lastEmailVerification && user.lastEmailVerification > new Date(new Date().getTime() - 2 * 60 * 1000) && !user.verified && user.codeForVerification){
                    throw new ApolloError('You have to wait 2 minutes before we sent you an email again. We have sent you an email with the verification link earlier. Check your email. If you did not receive the email, please check your spam folder. If you still did not receive the email, please contact us.')
                }
                if(user && !user.verified && user.lastEmailVerification && user.lastEmailVerification >  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)){
                    const codeForVerification = crypto.randomUUID({length: 32})
                    sendEmail(email, codeForVerification)
                    user.lastEmailVerification = new Date();
                    user.codeForVerification = codeForVerification;
                    await user.save()
                    throw new ApolloError('Your verification link has expired. We have sent you a new email with the verification link. Check your email for the verification link. If you did not receive the email, please check your spam folder. If you still did not receive the email, please contact us.')
                }         
                const codeForVerification = crypto.randomUUID({length: 32})
                if(user && !user.verified){
                    sendEmail(email, codeForVerification)
                    user.lastEmailVerification = new Date();
                    user.codeForVerification = codeForVerification;
                    await user.save()
                    throw new ApolloError('You have to verify your email address in order to register. Check your email for the verification link.')
                }
                if(user && user.verified){
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
                        admin: false,
                        solutions: [],
                        solvedProblems: [],
                        verified: false,
                        codeForVerification,
                        lastEmailVerification: new Date()
                    })
                    await newUser.save()
                    sendEmail(email, codeForVerification)
                    return {
                        success: true
                    }
                }
            }catch(err){
                throw new ApolloError(err)
            }
        },
        async login(_, {loginInput: {query, password, token}}, context){
            try{
                const responseTurnstile = await validateTurnstile(token, context.req)
                if(!responseTurnstile.success){
                    throw new ApolloError('Invalid captcha. Please submit again with the correct captcha. If you have any problems with the captcha, please refresh the page and try again or contact us.')
                }
                const user = await User.findOne({ $or : [{ username: query }, { email: query }]})
                if(!user){
                    throw new ApolloError('Invalid credentials. Please submit again with the correct credentials.');
                }
                if(!user.verified){
                    throw new ApolloError('This account is not verified. Register again and verify your email address.')
                }
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
            try{
              context.res.clearCookie('token', { httpOnly: true, secure: true });
              context.res.clearCookie('refreshToken', { httpOnly: true, secure: true });
            }catch(error){
              console.log(error)
            }                    
        },
        async createProblem(_, {problemInput: {title, description, requirements, type, tags, difficulty, category, subcategories, input, output, tests, timeExecution, limitMemory, examples, indications, languages, restriction}}, context){
            try{
                const problemsExists = await Problem.findOne({title});
                const creator = await getUser(context)
                if(problemsExists){
                    throw new ApolloError('Problem exists')
                }else{
                    if(!creator || !creator.admin || !creator.verified || !creator.username ||  !title || !requirements || !tags || !difficulty || !category || !subcategories || !input || !output || !tests || !timeExecution || !limitMemory || !languages){
                        throw new ApolloError('You have to fill all the fields')
                    }
                    description = DOMPurify.sanitize(description);
                    requirements = DOMPurify.sanitize(requirements);
                    input = DOMPurify.sanitize(input);
                    output = DOMPurify.sanitize(output);
                    examples = examples.map(example => {
                        return {
                            input: example.input,
                            output: example.output,
                            explanation: DOMPurify.sanitize(example.explanation)
                        }
                    })
                    restriction = DOMPurify.sanitize(restriction);
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
                const problema = await Problem.findOne({title: problem}).select('tests title type rejectedSolutions acceptedSolutions timeExecution limitMemory')
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
                const testResults = grader(problema.tests, code, problema.title, user.username,language, problema.timeExecution, problema.limitMemory)
                user.solutions.push(testResults)
                if(testResults.score === 100){
                    if(!user.solvedProblems.find(solved => solved.problem === problema.title)){
                        user.solvedProblems.push({problem: problema.title, date: new Date()});
                        await user.save();
                    }
                    problema.acceptedSolutions += 1;
                    await problema.save();
                }else{
                    problema.rejectedSolutions += 1;
                    await problema.save();
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
        },
        async verifyEmail(_, {token}, context){
            const user = await getUser(context);
            if(user){
                throw new ApolloError('You are already logged in')
            }
            const user_ = await User.findOne({codeForVerification: token})
            if(!user_){
                throw new ApolloError('This token is invalid')
            }
            user_.verified = true;
            user_.codeForVerification = '';
            await user_.save()
            return {
                success: true
            }
        },
        async changePassword(_, {currentpass, password, confirmPassword}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to change the password')
            }
            if(password !== confirmPassword){
                throw new ApolloError('Passwords do not match')
            }
            const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g
            if(!strongPassword.test(password)){
                throw new ApolloError('Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const matchPassword = await bcrypt.compare(currentpass, user.password)
            if(!matchPassword){
                throw new ApolloError('Invalid password')
            }
            user.password = hashedPassword;
            await user.save()
            return {
                success: true
            }
        },
        async changeUsername(_, {username, newUsername}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to change the username')
            }
            if(username !== user.username){
                throw new ApolloError('You have to be logged in with the same username in order to change the username. Please stop trying to hack the website!!!')
            }
            if(username === newUsername){
                throw new ApolloError('The new username is the same as the old one. You have to choose a different username')
            }
            if(newUsername.length < 4){
                throw new ApolloError('Username must be at least 4 characters long')
            }
            user.username = newUsername;
            await user.save()
            await User.updateMany({ "solutions.username": user.username }, { $set: { "solutions.$[elem].username": username } },{ arrayFilters: [{ "elem.username": user.username }] });
            await Problem.updateMany({ creator: username }, { $set: { creator: newUsername } });
            await Article.updateMany({ creator: username }, { $set: { creator: newUsername } });
            await Announcement.updateMany({ createdBy: username }, { $set: { createdBy: newUsername } });
            await Contest.updateMany({ createdBy: username }, { $set: { createdBy: newUsername } });
            await Contest.updateMany({ "participants.username": user.username }, { $set: { "participants.$[elem].username": username } },{ arrayFilters: [{ "elem.username": user.username }] });
            await Problem.updateMany({ "ratings.username": user.username }, { $set: { "ratings.$[elem].username": username } },{ arrayFilters: [{ "elem.username": user.username }] });
            return {
                success: true
            }
        },
        async changeEmail(_, {email, newEmail}, context){
            const user = await getUser(context);
            if(!user){
                throw new ApolloError('You have to be logged in order to change the email')
            }
            if(email !== user.email){
                throw new ApolloError('You have to be logged in with the same email in order to change the email. Please stop trying to hack the website!!!')
            }
            const exists = await User.findOne({email: newEmail})
            if(exists){
                throw new ApolloError('An account is already linked with this email')
            }
            const email_okey = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
            if(!email_okey.test(newEmail)){
                throw new ApolloError('Invalid email. Please submit again with a valid email.');
            }
            user.email = newEmail;
            await user.save()
            return {
                success: true
            }
        },
        async getChatbotMessage(_, {prompt, problem, code}, context){
            try{
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You have to be logged in to use the chatbot')
                }
                if(!prompt) throw new ApolloError('Prompt is null')
                if(!problem) throw new ApolloError('Problem is null')
                const problema = await Problem.findOne({title: problem})
                if(!problema) throw new ApolloError('This problem does not exist')
                const buildPrompt = 
                `Description: ${problema.description},
                Requirements: ${problema.requirements},
                Input: ${problema.input},
                Output: ${problema.output},
                Time Execution: ${problema.timeExecution},
                Limit Memory: ${problema.limitMemory},
                Code: ${code},
                I need help with this problem. 
                Based on the code above, please respond to the following prompt:
                ${prompt}, and provide me with just the code. Comment the code with the changes you made. Just the code, perhaps explanations, but comment them in the code.
                If you have any other additional information, please just comment it in the code. Respond to the prompt above with only the code you wrote. Remember that
                you must not add print statements or any other output statements (like : "Enter a number!"). It will be considered as a wrong answer.
                If there any syntax errors (like semicolon errors), logical errors, time performance errors, or memory errors, please fix them and explain why you made the changes you made by commenting in the code.
                Keep in mind that the input its not given as arguments, but you have to read it from the standard input. The output must be written to the standard output.`
                const completion = await client.chat.completions.create({
                    messages: [{ role: "system", content: buildPrompt    }],
                    model: "gpt-4",
                });
                const response = completion.choices[0].message.content
                if(response.includes('```')){
                    let codeResponse = response.split('```')[1]
                    codeResponse = codeResponse.split('\n').slice(1).join('\n')
                    return {
                        message: codeResponse
                    }
                }else{
                    return {
                        message: response
                    }
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async rateProblem(_, {id, rating}, context){
            try{
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You have to be logged in to rate a problem')
                }
                const problem = await Problem.findOne({title: id})
                if(!problem){
                    throw new ApolloError('This problem does not exist')
                }
                if(rating < 1 || rating > 5){
                    throw new ApolloError('Rating must be between 1 and 5')
                }
                if(problem.ratings.find(r => r.username === user.username)){
                    throw new ApolloError('You have already rated this problem')
                }
                problem.ratings.push({username: user.username, rating})
                await problem.save()
                return {
                    success: true
                }
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async authDiscord(_, {code}, context){
            try{
                const client_id = process.env.DISCORD_CLIENT_ID
                const client_secret = process.env.DISCORD_CLIENT_SECRET 
                const api_endpoint = 'https://discord.com/api/v10/oauth2/token'
                const params = new URLSearchParams({
                    client_id, 
                    client_secret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: process.env.DISCORD_REDIRECT_URI,
                    prompt: 'consent',
                })
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
                const response = await fetch(api_endpoint, {
                    method: 'POST',
                    headers,
                    body: params.toString()
                })
                const data = await response.json()
                if(data.error){
                    throw new ApolloError('Invalid code')
                }
                const api_endpoint_user = 'https://discord.com/api/v10/oauth2/@me'
                const user_data = await fetch(api_endpoint_user, {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`
                    },

                })
                const user = await user_data.json()
                const exists = await User.findOne({discordID: user.user.id})
                if(exists){
                    const token = generateToken(exists)
                    const refreshToken = generateRefreshToken(exists);
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
                }else {
                    const exits_username = await User.findOne({username: user.user.username})
                    if(exits_username){
                        throw new ApolloError('This username is already taken. You cant link your discord account with this username')
                    }
                    const newUser = new User({discordID: user.user.id, username: user.user.username, email: user.user.email, verified: true, admin: false, solutions: [], solvedProblems: []})
                    await newUser.save()
                    const token = generateToken(newUser)
                    const refreshToken = generateRefreshToken(newUser);
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
            }catch(e){
                throw new ApolloError(e)
            }
        },
        async createReport(_, {title, description, reporter, type, problem}, context){
            try{
                const user = await getUser(context);
                if(!user){
                    throw new ApolloError('You have to be logged in to report a problem')
                }
                if(!title || !description || !reporter || !type){
                    throw new ApolloError('You have to fill all the fields')
                }
                if(type === 'problem' && !problem){
                    throw new ApolloError('You have to fill all the fields')
                }
                if(type == 'problem'){
                    const exists = await Problem.findOne({title: problem})
                    if(!exists){
                        throw new ApolloError('This problem does not exist')
                    }
                    const newReport = new Report({title, description, reporter, type, problem})
                    await newReport.save()
                }
                return {
                    success: true
                }
            }catch(e){
                throw new ApolloError(e)
            }
        }
    }
}
