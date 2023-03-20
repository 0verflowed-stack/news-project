const { ObjectId } = require('mongodb');
const { model, Schema } = require('mongoose');

const newsShema = new Schema({
    title: String,
    likes: Number,
    dislikes: Number,
    comments: [{ body: String, date: String, user_id: { type: 'ObjectId', ref: 'User' } }],
    time: String
});

module.exports = model('News', newsShema);