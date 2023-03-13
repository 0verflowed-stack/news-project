import redis from 'redis';
import { Builder, By, Browser, until } from 'selenium-webdriver';

const redisUrl = 'redis://redis:6379';
const newsUrl = 'https://www.ukr.net/ua/news/main.html';
const seleniumUrl = 'http://selenium-hub:4444/wd/hub';
const $parseInterval = 60 * 1000;
const $locateElemTimeout = 1000;

const publisher = redis.createClient({url: redisUrl});

await publisher.connect();

const getNews = async () => {
  const driver = await new Builder().forBrowser(Browser.CHROME).usingServer(seleniumUrl).build();

  try {
    await driver.get(newsUrl);

    await driver.wait(until.elementLocated(By.css("a")), $locateElemTimeout);
    const elements = await driver.findElements(By.css("a.im-tl_a"));
  
    const news = await Promise.all(elements.map(el => el.getText()));

    await publisher.publish('article', JSON.stringify(news));
  } finally {
    await driver.quit();
  }
  setTimeout(getNews, $parseInterval);
};

getNews();