const User = require('../../models/User');
const News = require('../../models/News');
const { Types } = require('mongoose');
const auth = require('../../middleware/auth');
const redis = require('redis');

const redisUrl = 'redis://redis:6379';

const redisClient = redis.createClient({ url: redisUrl });

(async () => {
    await redisClient.connect();
})()

redisClient.on('error', (err) => {
    console.log(`Errpr ${err}`);
});


module.exports = {
    Mutation: {
        async updateLike(_, { likeInput: { action, post } }, { token }) {
            const user = await auth(token);
            await redisClient.flushAll();
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
            await redisClient.flushAll();
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
            await redisClient.flushAll();
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

            let news;
            const newsCacheKey = 'news';
            // await redisClient.flushAll();
            try {
                const newsCache = await redisClient.get(newsCacheKey);
                if (newsCache !== null) {
                    console.log('Get from cache');
                    news = JSON.parse(newsCache);
                } else {
                    news = await News.find().lean();
                    console.log('Get from db');
                    //console.log('newsnews', news);
                    await redisClient.set(newsCacheKey, JSON.stringify(news));
                    await redisClient.expire(newsCacheKey, 60);
                }
            } catch (e) {
                console.log(`catch ${e}, ${redisClient}`);
                news = await News.find().lean();
            }
            news.sort((a, b) => Number(b.time) - Number(a.time))
            news = news.map(newsItem => {
                newsItem.id = newsItem._id.toString();
                // Fix likes/dislikes/comments count not correct id data is from redis cache
                if (userDb.likes.map(x => x.news_id.toString()).includes(newsItem._id.toString())) {
                    newsItem.liked = true;
                } else {
                    newsItem.liked = false;
                }
                if (userDb.dislikes.map(x => x.news_id.toString()).includes(newsItem._id.toString())) {
                    newsItem.disliked = true;
                } else {
                    newsItem.disliked = false;
                }
                newsItem.comments = newsItem.comments.map(x => {
                    const { username } = users.filter(y => y._id.toString() === x.user_id.toString())[0];
                    x.username = username;
                    x.id = x._id.toString();
                    return x;
                });
                const newsCategory = userDb.news.filter(x => x.news_id.toString() === newsItem.id)[0]?.category;
                newsItem.category = newsCategory || '';
                return newsItem;
            });
            return news;
        }
    }
}