const User = require('../../../models/user');
module.exports = {
    async getUsers(){
        return await User.find({}).sort({createdAt: -1})
    },
}
