const User = require('../../../models/user')
const { generateToken, generateRefreshToken } = require('../../../utils/getUser') 
const {ApolloError} = require('apollo-server-express')

module.exports = {
    async authDiscord(_, {code}, context){
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
    }
}