const User = require('../../../models/user');
const {getUser} = require('../../../utils/getUser');

module.exports = {
    async updateProfilePicture(_, {profilePicture}, context) {
        const user = await getUser(context);
        user.profilePicture = profilePicture;
        await user.save();
        return {
            success: true
        }
    }
}