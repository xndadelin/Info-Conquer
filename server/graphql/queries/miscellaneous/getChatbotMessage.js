const openai = require('openai');
const client = new openai(process.env.OPENAI_API_KEY);
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async getChatbotMessage(_, {prompt, problem, code}, context){
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
    }
}