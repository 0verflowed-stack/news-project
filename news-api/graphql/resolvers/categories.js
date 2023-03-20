const User = require('../../models/User');
const News = require('../../models/News');
const { Types } = require('mongoose');
const auth = require('../../middleware/auth');
const redis = require('redis');
const Categories = require('../../models/Category');

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
        async updateCategory(_, { categoryInput: { category, postId } }, { token }) {
            const user = await auth(token);
            console.log("Here");

            const userDb = await User.findOne({ _id: new Types.ObjectId(user.user_id) });
            const idx = userDb.news.findIndex(x => x.news_id.toString() === postId);

            if (idx !== -1) {
                userDb.news[idx].category = category;
            } else {
                userDb.news.push({ news_id: new Types.ObjectId(postId), category });
            }
            await userDb.save();
            
            return true;
        }
    },
    Query: {
        categories: async (_, __, { token }) => {
            await auth(token);
            let categories;
            console.log('categories', categories);
            const cacheKey = 'categories';
            try {
                const categoriesCache = await redisClient.get(cacheKey);
                if (categoriesCache !== null) {
                    console.log('Get from cache categories');
                    categories = JSON.parse(categoriesCache);
                } else {
                    categories = await Categories.find().lean();
                    console.log('Get from db categories');
                    await redisClient.set(cacheKey, JSON.stringify(categories));
                    await redisClient.expire(cacheKey, 24 * 60 * 60);
                }
            } catch (e) {
                console.log(`catch ${e}, ${redisClient}`);
                categories = await Categories.find().lean();
            }
            return categories.map(x => x.category);
        }
    }
}