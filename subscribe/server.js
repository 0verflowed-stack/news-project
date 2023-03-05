import redis from 'redis';
import { MongoClient } from 'mongodb';

const uri = "mongodb://mongo:27017/news-consumer";

const mongoClient = new MongoClient(uri);

const redisUrl = 'redis://redis:6379';

const subscriber = redis.createClient({ url: redisUrl });

await subscriber.connect();

async function run(texts) {
    const database = mongoClient.db('news');
    const news = database.collection('news');

    const data = texts.map(text => ({ title: text }));
    // Add logic to check if news items are already in db
    console.log("Before")
    const manyNews = await news.insertMany(data);
    console.log("manyNews", manyNews);
}

await subscriber.subscribe('article', (message) => {
    console.log("message", message);
    run(JSON.parse(message)).catch(console.dir);
});

console.log('News subscriber started');