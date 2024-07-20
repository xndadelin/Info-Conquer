const {getUser} = require('../../../utils/getUser');

module.exports = {
    async updateBio(_, {bio}, context) {
        if(!bio) {
            throw new Error('Bio cannot be empty');
        }
        const user = await getUser(context);
        user.bio = bio;
        await user.save();
        return {
            success: true
        }
    }
}