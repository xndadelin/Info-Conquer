const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {ApolloError} = require('apollo-server-express')
const cookie = require('cookie')
const generateToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET, { expiresIn: '10s' });
};
  
const generateRefreshToken = (user) => {
    return jwt.sign({ username: user.username, admin: user.admin }, process.env.SECRET_REFRESH, { expiresIn: '24h' });
};
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
            try{
                const cookies = cookie.parse(context.req.headers.cookie) || ''
                const token = cookies.token;
                const refreshtoken = cookies.refreshToken
                if(!token && !refreshtoken){
                    return null;
                }
                const verified = jwt.verify(token, process.env.SECRET);
                if(verified.username){
                    const username = verified.username
                    const user = await User.findOne({username})
                    return user;
                }else{
        
                        const refreshVerified = jwt.verify(refreshtoken, process.env.SECRET_REFRESH);
                            if(refreshVerified){
                            const newToken = generateToken(refreshVerified)
                            const newRefreshToken = generateRefreshToken(refreshVerified)
                            context.res.cookie('token', newToken, {
                                httpOnly: true, 
                                secure: true
                            })
                            context.res.cookie('refreshToken', newRefreshToken, {
                                httpOnly: true, 
                                secure: true
                            })
                            const refreshedUser = await User.findOne({username: refreshVerified.username})
                            return refreshedUser
                        }
                }
                return null
            }catch(err){
                if (err.name === 'TokenExpiredError') {
                        const refreshtoken =  cookie.parse(context.req.headers.cookie).refreshToken
                        const refreshVerified = jwt.verify(refreshtoken, process.env.SECRET_REFRESH);
                        if (refreshVerified) {
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
                            const refreshedUser = await User.findOne({username: refreshVerified.username})
                            return refreshedUser
                        }
                }
                return null;
            }
        }
    },
    Mutation: {
        async register(_, { registerInput: { username, email, password}}, context){
            try{
                const user = await User.findOne({ $or : [{ username }, { email }]})
                if(user){
                    throw new ApolloError('An account is already linked with these credentials. Please change the credentials to continue registering.');
                }else{
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    const newUser = new User({
                        username,
                        email,
                        password: hashedPassword,
                        admin: false
                    })
                    const res = await newUser.save()
                    return {
                        success: true
                    }
                }
            }catch(err){
                throw new ApolloError(err)
            }
        },
        async login(_, {loginInput: {query, password}}, context){
            try{
                const user = await User.findOne({ $or : [{ username: query }, { email: query }]})
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
                            ...user._doc
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
            context.res.clearCookie('token', { httpOnly: true, secure: true });
            context.res.clearCookie('refreshToken', { httpOnly: true, secure: true });
            return {
                success: true
            }
        }
    }
}