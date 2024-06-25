const User = require('../../../models/user');
const { getUser } = require('../../../utils/getUser');
module.exports = {
    async getSolution(_, {id}, context) {
        const user = await getUser(context)
        const solution = await User.findOne({"solutions.id_solution": id}, {"solutions.$": 1});
        if(user.username !== solution.solutions[0].username) return null 
        return solution.solutions[0]
    }
}