const messagesResolvers = require('./messages');
const usersResolvers = require('./users');
const newsResolvers = require('./news');

module.exports = {
    Query: {
        ...messagesResolvers.Query,
        ...usersResolvers.Query,
        ...newsResolvers.Query
    },
    Mutation: {
        ...messagesResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...newsResolvers.Mutation
    },
};