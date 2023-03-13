const { model, Schema } = require('mongoose');

const userShema = new Schema({
    title: String,
    likes: Number,
    dislikes: Number,
    comments: [{ body: String, username: String }],
    category: String,
    time: String
});

module.exports = model('News', userShema);