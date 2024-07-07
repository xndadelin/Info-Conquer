const User = require('../../../models/user');
const { getUser } = require('../../../utils/getUser');
const bcrypt = require('bcrypt');
module.exports = {
    async resetPassword(_, { password, confirmPassword, codeForVerification}) {
        const user = await User.findOne({ codeForVerification });
        if (!user) {
            throw new Error('Invalid code for verification');
        }
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g
        if(!strongPassword.test(password)){
            throw new ApolloError('Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
        }
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);
        user.codeForVerification = null;
        await user.save();
        return {
            success: true
        }
    }
}