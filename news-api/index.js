const { ApolloServer }  = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const auth = require('./middleware/auth');

const MONGODB = "mongodb://mongo:27017/news-consumer";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
        token: req.headers.authorization,
    })
});

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({port: 5000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    });