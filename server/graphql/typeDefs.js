const {mergeTypeDefs} = require('@graphql-tools/merge')

const user = require('./typeDefs/user')
const solutions = require('./typeDefs/solutions')
const problem = require('./typeDefs/problem')
const response = require('./typeDefs/response')
const mutations = require('./typeDefs/mutations')
const queries = require('./typeDefs/queries')
const article = require('./typeDefs/article')
const announcement = require('./typeDefs/announcement')

module.exports = mergeTypeDefs([user, article, solutions, problem, response, mutations, queries, announcement])