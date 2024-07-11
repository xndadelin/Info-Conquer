const User = require('../../../models/user');
const {getUser} = require('../../../utils/getUser');

module.exports = {
    async updateProfilePicture(_, {profilePicture}, context) {
        const user = await getUser(context);
        if(!user) throw new Error('User not found');
        user.profilePicture = profilePicture;
        await user.save();
        return {
            success: true
        }
    }
}