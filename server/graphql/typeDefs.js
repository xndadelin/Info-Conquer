const {mergeTypeDefs} = require('@graphql-tools/merge')

const user = require('./typeDefs/user')
const solutions = require('./typeDefs/solutions')
const problem = require('./typeDefs/problem')
const response = require('./typeDefs/response')
const mutations = require('./typeDefs/mutations')
const queries = require('./typeDefs/queries')


module.exports = mergeTypeDefs([user, solutions, problem, response, mutations, queries])