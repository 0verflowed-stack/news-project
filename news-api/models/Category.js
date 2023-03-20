const { model, Schema } = require('mongoose');

const categoryShema = new Schema({
    caregory: String
});

module.exports = model('Categories', categoryShema);