const {validateTurnstile} = require('../../../utils/validateTurnstile')
const {generateToken, generateRefreshToken} = require('../../../utils/getUser')
const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
const bcrypt = require('bcrypt')
module.exports = {
    async login(_, {loginInput: {query, password, token}}, context){
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
        if(user && user.password){
            const matchPassword = await bcrypt.compare(password, user.password)
            if(!matchPassword){
                throw new ApolloError('Invalid credentials. Please submit again with the correct credentials.');
            }else{
                const token = generateToken(user)
                const refreshToken = generateRefreshToken(user);
                context.res.cookie('token', token)
                context.res.cookie('refreshToken', refreshToken)
                return {
                    success: true, 
                }
            }
        }else{
            throw new ApolloError('Invalid credentials. Please submit again with the correct credentials.');
        }
    }
}