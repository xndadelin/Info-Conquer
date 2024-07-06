const {getUser} = require('../../../utils/getUser');

module.exports = {
    async updateBio(_, {bio}, context) {
        console.log(bio);
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