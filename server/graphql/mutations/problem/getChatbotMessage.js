const openai = require('openai');
require('dotenv').config();
const client = new openai({
    apiKey: process.env.OPENAI_API_KEY,
});
const { getUser } = require('../../../utils/getUser')
const {ApolloError} = require('apollo-server-express')
const Problem = require('../../../models/problem')
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
        `Problem Description: ${problema.description}
        Requirements: ${problema.requirements}
        Input Format: ${problema.input}
        Output Format: ${problema.output}
        Time Execution Limit: ${problema.timeExecution}
        Memory Limit: ${problema.limitMemory}
        Initial Code Provided:
        ${code}
    
        I need assistance with solving this problem. Please address the following prompt based on the provided code:
        ${prompt}
    
        Your response should include only the modified code. Ensure to comment on any changes made. Avoid adding print statements or any additional output statements, as they will be considered incorrect answers.
    
        If there are syntax errors, logical errors, or issues related to time or memory performance, please correct them and provide explanations within the code.
    
        Note that input is not provided as function arguments but should be read from standard input, and output should be written to standard output.
        `;
            
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