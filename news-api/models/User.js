const { model, Schema } = require('mongoose');

const userShema = new Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    likes: [{ news_id: { type: 'ObjectId', ref: 'News' }}],
    dislikes: [{ news_id: { type: 'ObjectId', ref: 'News' }}],
    comments: [[{ news_id: { type: 'ObjectId', ref: 'News' }, comment_id: { type: 'ObjectId' } }]],
    news: [{ news_id: { type: 'ObjectId', ref: 'News' }, category: String }]
});

module.exports = model('User', userShema);