const { getUser } = require('../../../utils/getUser')

module.exports = {
    async getUser(_, {}, context){
        return getUser(context)
    },
}