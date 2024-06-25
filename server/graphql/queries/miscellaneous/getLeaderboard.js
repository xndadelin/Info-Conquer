const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
      async getLeaderboard(_, {}, context){
          const users = await User.aggregate([
              {
                $project: {
                  username: 1,
                  solvedProblems: { $size: "$solvedProblems" }
                }
              },
              {
                $sort: { solvedProblems: -1 }
              }
          ])
          return users
      }
}