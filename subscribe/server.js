import redis from 'redis';
import { MongoClient } from 'mongodb';

const uri = "mongodb://mongo:27017/news-consumer";
const redisUrl = 'redis://redis:6379';

const mongoClient = new MongoClient(uri);

const subscriber = redis.createClient({ url: redisUrl });

await subscriber.connect();

async function run(texts) {
    const database = mongoClient.db('news');
    const news = database.collection('news');
    news.createIndex({title: 1}, {unique: true});

    const data = texts.map(text => ({ title: text }));

    console.log("Before insert")
    await Promise.allSettled(data.map(item => news.insertOne(item)));
    console.log("All news items", await news.find().toArray())
}

await subscriber.subscribe('article', (message) => {
    console.log("message", message);
    run(JSON.parse(message)).catch(console.dir);
});

console.log('News subscriber started');