const messagesResolvers = require('./messages');
const usersResolvers = require('./users');
const newsResolvers = require('./news');
const categoriesResolvers = require('./categories');

module.exports = {
    Query: {
        ...messagesResolvers.Query,
        ...usersResolvers.Query,
        ...newsResolvers.Query,
        ...categoriesResolvers.Query
    },
    Mutation: {
        ...messagesResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...newsResolvers.Mutation,
        ...categoriesResolvers.Mutation
    },
};