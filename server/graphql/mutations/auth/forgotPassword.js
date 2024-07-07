const User = require('../../../models/user');
const { sendEmail } = require('../../../utils/sendForgotPasswordEmail');
module.exports = {
    async forgotPassword(_, { email }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const codeForVerification = crypto.randomUUID();
        user.codeForVerification = codeForVerification;
        await user.save();
        sendEmail(email, codeForVerification);
        return {
            success: true
        }
    }
}