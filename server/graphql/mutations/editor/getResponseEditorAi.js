const { getUser } = require("../../../utils/getUser")
const openai = require('openai');
const client = new openai(process.env.OPENAI_API_KEY);

module.exports = {
    async getResponseEditorAi(_, {userPrompt, content}, context){
        const user = await getUser(context)
        if(!user) throw new ApolloError('You must be logged in to perform this action')
        const aiPrompt = `
            You are an assistant that generates HTML content for a text editor. Based on the following input from the user, create a well-structured HTML snippet:
            User input: "${userPrompt}"
            Context content: "${content}"
            Please provide the HTML code only, no body or head tags are needed, just the content. Wrap the whole content in an artickle tag.
            If you provide style, make sure to use inline styles.
        `;
        const completion = await client.chat.completions.create({
            messages: [{ role: "system", content: aiPrompt }],
            model: "gpt-4",
        });
        const response = completion.choices[0].message.content
        return {
            response
        }
    }
}