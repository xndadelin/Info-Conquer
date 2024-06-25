const Problem = require('../../../models/problem')
const {ApolloError} = require('apollo-server-express')
const User = require('../../../models/user')
module.exports = {
    async getProblemStats(_, {id}, context){
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
    }
}