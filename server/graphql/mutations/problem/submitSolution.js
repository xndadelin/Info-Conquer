const Problem = require('../../../models/problem')
const Contest = require('../../../models/contest')
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
const { grader } = require('../../../utils/graders/grader')
const Daily = require('../../../models/daily')
module.exports = {
    async submitSolution(_, {solutionInput: {problem, code, language, type}}, context){
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
            if(now > contest.endDate){
                throw new ApolloError('This contest has ended')
            }
            if(now < contest.startDate){
                throw new ApolloError('This contest has not started yet')
            }
        }
        const testResults = grader(problema.tests, code, problema.title, user.username,language, problema.timeExecution, problema.limitMemory)
        user.solutions.push(testResults)
        user.activity.push({date: new Date(), message: `${user.username} has submitted the code on problem ${problem} and scored ${testResults.score}`})
        if(testResults.score === 100){
            if(!user.solvedProblems.find(solved => solved.problem === problema.title)){
                user.solvedProblems.push({problem: problema.title, date: new Date()});
                user.activity.push({date: new Date(), message: `${user.username} has solved the ${problem} problem!`})
            }
            problema.acceptedSolutions += 1;
            if(type.split(':')[0] === 'daily'){
                const dates = type.split(':')[1].split("/")
                const year = dates[0], month = dates[1], day = dates[2];
                const date = new Date(Date.UTC(year, month - 1, day)).toISOString().replace('Z', '+00:00')
                const daily = await Daily.findOne({date})
                if(!daily) throw new ApolloError('This daily does not exist')
                if(daily.ended) throw new ApolloError('This daily has ended')
                daily.solvers.push(user.username)
                await daily.save()
            
            }
            await problema.save();
        }else{
            problema.rejectedSolutions += 1;
            await problema.save();
        }
        if(contest){
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
    }
}

