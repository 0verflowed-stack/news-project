import redis from 'redis';
import { MongoClient } from 'mongodb';

const uri = "mongodb://mongo:27017/news-consumer";
const redisUrl = 'redis://redis:6379';

const mongoClient = new MongoClient(uri);

const subscriber = redis.createClient({ url: redisUrl });

await subscriber.connect();

async function run(texts) {
    const database = mongoClient.db('news-consumer');
    const news = database.collection('news');
    news.createIndex({title: 1}, {unique: true});

    const data = texts.map(text => ({
        title: text,
        likes: 0,
        dislikes: 0,
        comments: [],
        time: Date.now().toString()
    }));

    await Promise.allSettled(data.map(item => news.insertOne(item)));
}

await subscriber.subscribe('article', (message) => {
    run(JSON.parse(message)).catch(console.dir);
});