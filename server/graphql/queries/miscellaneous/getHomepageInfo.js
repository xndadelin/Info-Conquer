const Problem = require('../../../models/problem')
const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getHomepageInfo(_, {}, context){
        try{
            const user = await getUser(context)
            const problems = (await Problem.find({}).sort({acceptedSolutions: -1}).limit(5))
            const dates = []
            const today = new Date()
            dates.push(new Date(today))
            for (let i = 1; i <= 6; i++) {
                const newDate = new Date(today);
                newDate.setDate(today.getDate() - i);
                newDate.setHours(0, 0, 0, 0);
                dates.push(newDate);
            }
            const results = await Promise.all(dates.map(async(date, index) => {
                const submissions = await User.aggregate([
                    { $unwind: '$solutions' },
                    { $match : {
                        'solutions.date' : {
                            $lt: new Date(date)
                        },
                        username: user.username
                    }},
                    { $group : {
                        _id: null, 
                        count: { $sum : 1 }
                    }}
                ])
                const count = submissions.length > 0 ? submissions[0].count : 0;
                return { date, count };
            }))
            
            return {
                topProblems: problems.map(problem => {
                    return {
                        title: problem.title,
                        difficulty: problem.difficulty,
                        tags: problem.tags,
                        successRate: problem.successRate
                    }
                }),
                lastSeven: results
            }
        }catch(e){
            throw new ApolloError(e)
        }
    }
}