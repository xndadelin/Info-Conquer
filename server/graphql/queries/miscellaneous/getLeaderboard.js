const User = require('../../../models/user')

module.exports = {
      async getLeaderboard(_, {}){
          const users = await User.aggregate([
              {
                $match: { verified: true }
              },
              {
                $project: {
                  username: 1,
                  solvedProblems: { $size: "$solvedProblems" },
                  profilePicture: 1
                }
              },
              {
                $sort: { solvedProblems: -1 }
              }
          ])
          return users
      }
}