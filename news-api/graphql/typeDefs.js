const { gql } = require('apollo-server');

module.exports = gql`
type Message {
    text: String
    createdAt: String
    createdBy: String
}

type User {
    username: String
    email: String
    password: String
    token: String
}

type Comment {
    body: String
    username: String
    date: String
    id: String
}

type News {
    id: String
    title: String
    likes: Int
    liked: Boolean
    dislikes: Int
    disliked: Boolean
    comments: [Comment]
    category: String
    time: String
}

input MessageInput {
    text: String
    username: String
}

input RegisterInput {
    username: String
    email: String
    password: String
    confirmPassword: String
}

input LoginInput {
    email: String
    password: String
}

input LikeInput {
    action: Boolean
    post: ID
}

input DislikeInput {
    action: Boolean
    post: ID
}

input CommentInput {
    action: Boolean
    postId: ID
    commentId: ID
    body: String
    date: String
}

type Query {
    message(id: ID!): Message
    user(id: ID!): User
    news: [News]
}

type Mutation {
    createMessage(messageInput: MessageInput): Message!
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
    updateLike(likeInput: LikeInput): Boolean
    updateDislike(dislikeInput: DislikeInput): Boolean
    updateComment(commentInput: CommentInput): String
}
`