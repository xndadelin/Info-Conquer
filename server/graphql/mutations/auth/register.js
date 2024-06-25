const User = require('../../../models/user')
const {sendEmail} = require('../../../utils/sendEmail')
const { validateTurnstile } = require('../../../utils/validateTurnstile')
const bcrypt = require('bcrypt')
global.crypto = require('crypto');
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async register(_, { registerInput: { username, email, password, confirmPassword, token}}, context){
        const responseTurnstile = await validateTurnstile(token, context.req)
        if(!responseTurnstile.success){
            throw new ApolloError('Invalid captcha. Please submit again with the correct captcha. If you have any problems with the captcha, please refresh the page and try again or contact us.')
        }
        const user = await User.findOne({ $or : [{ username }, { email }]})
        if(user && user.lastEmailVerification && user.lastEmailVerification > new Date(new Date().getTime() - 2 * 60 * 1000) && !user.verified && user.codeForVerification){
            throw new ApolloError('You have to wait 2 minutes before we sent you an email again. We have sent you an email with the verification link earlier. Check your email. If you did not receive the email, please check your spam folder. If you still did not receive the email, please contact us.')
        }
        if(user && !user.verified && user.lastEmailVerification && user.lastEmailVerification >  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)){
            const codeForVerification = crypto.randomUUID({length: 32})
            sendEmail(email, codeForVerification)
            user.lastEmailVerification = new Date();
            user.codeForVerification = codeForVerification;
            await user.save()
            throw new ApolloError('Your verification link has expired. We have sent you a new email with the verification link. Check your email for the verification link. If you did not receive the email, please check your spam folder. If you still did not receive the email, please contact us.')
        }         
        const codeForVerification = crypto.randomUUID({length: 32})
        if(user && !user.verified){
            sendEmail(email, codeForVerification)
            user.lastEmailVerification = new Date();
            user.codeForVerification = codeForVerification;
            await user.save()
            throw new ApolloError('You have to verify your email address in order to register. Check your email for the verification link.')
        }
        if(user && user.verified){
            throw new ApolloError('An account is already linked with these credentials. Please change the credentials to continue registering.');
        }else{
            if(username.length < 4){
                throw new ApolloError('Username must be at least 4 characters long');
            }
            const email_okey = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
            if(password !== confirmPassword){
                throw new ApolloError('Passwords do not match. Please submit again with matching passwords.');
            }
            if(!email_okey.test(email)){
                throw new ApolloError('Invalid email. Please submit again with a valid email.');
            }
            const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g
            if(!strongPassword.test(password)){
                throw new ApolloError('Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                admin: false,
                solutions: [],
                solvedProblems: [],
                verified: false,
                codeForVerification,
                lastEmailVerification: new Date()
            })
            await newUser.save()
            sendEmail(email, codeForVerification)
            return {
                success: true
            }
        }
    }
}