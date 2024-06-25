const User = require('../../../models/user')
const {ApolloError} = require('apollo-server-express')
module.exports = {
      async getLeaderboard(_, {}, context){
          try{
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
          }catch(e){
              throw new ApolloError(e)
          }
      }
}