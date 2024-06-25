const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const Problem = require('../../../models/problem')
const { getUser } = require('../../../utils/getUser') 
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async createProblem(_, {problemInput: {title, description, requirements, type, tags, difficulty, category, subcategories, input, output, tests, timeExecution, limitMemory, examples, indications, languages, restriction, itsForContest}}, context){
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
            const problem =  new Problem({creator: creator.username, title, description, requirements, type, tags, difficulty, category, subcategories, input, output, tests, timeExecution, limitMemory, examples, indications, languages, restriction, itsForContest})
            await problem.save()
            return {
                success: true
            }
        }
    }
}