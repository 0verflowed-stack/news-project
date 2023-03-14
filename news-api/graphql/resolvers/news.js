const { ApolloError } = require('apollo-server/dist');
const User = require('../../models/User');
const News = require('../../models/News');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Types } = require('mongoose');
const auth = require('../../middleware/auth');

module.exports = {
    Mutation: {
        async updateLike(_, { likeInput: { action, post } }, { token }) {
            const user = await auth(token);
            if (action) {
                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });
                userDb.likes.push({news_id: new Types.ObjectId(post)});
                

                let dislikesChange = 0;

                const stringIds = userDb.dislikes.map(x => x.news_id.toString());

                if (stringIds.includes(post)) {
                    dislikesChange = -1;
                    userDb.dislikes.splice(stringIds.findIndex(el => el === post), 1);
                }

                await userDb.save();

                const news = await News.findOne({ _id: new Types.ObjectId(post) });
                await news.updateOne({likes: news.likes + 1, dislikes: news.dislikes + dislikesChange});
                
            } else {
                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });

                const stringIds = userDb.likes.map(x => x.news_id.toString());

                if (stringIds.includes(post)) {
                    userDb.likes.splice(stringIds.findIndex(el => el === post), 1);
                }

                await userDb.save();

                const news = await News.findOne({ _id: new Types.ObjectId(post) });
                await news.updateOne({likes: news.likes - 1});
            }

            return true;
        },
        async updateDislike(_, { dislikeInput: { action, post } }, { token }) {
            const user = await auth(token);
            if (action) {
                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });
                userDb.dislikes.push({news_id: new Types.ObjectId(post)});

                let likesChange = 0;

                const stringIds = userDb.likes.map(x => x.news_id.toString());

                if (stringIds.includes(post)) {
                    likesChange = -1;
                    userDb.likes.splice(stringIds.findIndex(el => el === post), 1);
                }

                await userDb.save();

                const news = await News.findOne({ _id: new Types.ObjectId(post) });
                await news.updateOne({dislikes: news.dislikes + 1, likes: news.likes + likesChange});
            }  else {
                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });

                const stringIds = userDb.dislikes.map(x => x.news_id.toString());

                if (stringIds.includes(post)) {
                    userDb.dislikes.splice(stringIds.findIndex(el => el === post), 1);
                }

                await userDb.save();

                const news = await News.findOne({ _id: new Types.ObjectId(post) });
                await news.updateOne({dislikes: news.dislikes - 1});
            }

            return true;
        },
        async updateComment(_, { commentInput: { action, postId, commentId, body, date } }, { token }) {
            const user = await auth(token);
            const id = new Types.ObjectId();
            if (action) {
                const news = await News.findOne({ _id: new Types.ObjectId(postId) });
                
                news.comments.push({ _id: id, body, user_id: user.user_id, date });
                await news.save();

                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });
                userDb.comments.push({ news_id: postId, comment_id: id });
                await userDb.save();
            } else {
                const news = await News.findOne({ _id: new Types.ObjectId(postId) });
                const lenPrev = news.comments.length;
                news.comments = news.comments.filter(x => x._id.toString() !== commentId || x.user_id.toString() !== user.user_id);
                const lenAfter = news.comments.length;
                await news.save();

                if (lenPrev === lenAfter) {
                    return '';
                }

                const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });
                userDb.comments = userDb.comments.filter(x => x.news_id.toString() !== postId || x.comment_id.toString() !== commentId);
                await userDb.save();
                return '';
            }

            return id.toString();
        }
    },
    Query: {
        news: async (_, __, { token }) => {
            const user = await auth(token);
            const users = await User.find();
            const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });

            let news = await News.find();
            news.sort((a, b) => Number(b.time) - Number(a.time))
            news = news.map(newsItem => {
                newsItem._doc.id = newsItem._id.toString();
                if (userDb.likes.map(x => x.news_id.toString()).includes(newsItem._id.toString())) {
                    newsItem.liked = true;
                }
                if (userDb.dislikes.map(x => x.news_id.toString()).includes(newsItem._id.toString())) {
                    newsItem.disliked = true;
                }
                newsItem.comments = newsItem.comments.map(x => {
                    const { username } = users.filter(y => y._id.toString() === x.user_id.toString())[0];
                    x.username = username;
                    x._doc.id = x._id.toString();
                    return x;
                });
                return newsItem;
            });
            return news;
        }
    }
}