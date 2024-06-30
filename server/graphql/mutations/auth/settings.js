const { getUser } = require('../../../utils/getUser')
const User = require('../../../models/user')
const Problem = require('../../../models/problem')
const Article = require('../../../models/article')
const Contest = require('../../../models/contest')
const Announcement = require('../../../models/announcements')
const {ApolloError} = require('apollo-server-express')
module.exports = {
    async changePassword(_, {currentpass, password, confirmPassword}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to change the password')
        }
        if(password !== confirmPassword){
            throw new ApolloError('Passwords do not match')
        }
        const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g
        if(!strongPassword.test(password)){
            throw new ApolloError('Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const matchPassword = await bcrypt.compare(currentpass, user.password)
        if(!matchPassword){
            throw new ApolloError('Invalid password')
        }
        user.password = hashedPassword;
        await user.save()
        return {
            success: true
        }
    },
    async changeUsername(_, {username, newUsername}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to change the username')
        }
        if(username !== user.username){
            throw new ApolloError('You have to be logged in with the same username in order to change the username. Please stop trying to hack the website!!!')
        }
        if(username === newUsername){
            throw new ApolloError('The new username is the same as the old one. You have to choose a different username')
        }
        if(newUsername.length < 4){
            throw new ApolloError('Username must be at least 4 characters long')
        }
        user.username = newUsername;
        await user.save()
        await User.updateMany({ "solutions.username": username }, { $set: { "solutions.$[elem].username": newUsername } },{ arrayFilters: [{ "elem.username": user.username }] });
        await Problem.updateMany({ creator: username }, { $set: { creator: newUsername } });
        await Article.updateMany({ creator: username }, { $set: { creator: newUsername } });
        await Announcement.updateMany({ createdBy: username }, { $set: { createdBy: newUsername } });
        await Contest.updateMany({ createdBy: username }, { $set: { createdBy: newUsername } });
        await Contest.updateMany({ "participants.username": user.username }, { $set: { "participants.$[elem].username": username } },{ arrayFilters: [{ "elem.username": user.username }] });
        await Problem.updateMany({ "ratings.username": user.username }, { $set: { "ratings.$[elem].username": username } },{ arrayFilters: [{ "elem.username": user.username }] });
        return {
            success: true
        }
    },
    async changeEmail(_, {email, newEmail}, context){
        const user = await getUser(context);
        if(!user){
            throw new ApolloError('You have to be logged in order to change the email')
        }
        if(email !== user.email){
            throw new ApolloError('You have to be logged in with the same email in order to change the email. Please stop trying to hack the website!!!')
        }
        const exists = await User.findOne({email: newEmail})
        if(exists){
            throw new ApolloError('An account is already linked with this email')
        }
        const email_okey = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if(!email_okey.test(newEmail)){
            throw new ApolloError('Invalid email. Please submit again with a valid email.');
        }
        user.email = newEmail;
        await user.save()
        return {
            success: true
        }
    }
}