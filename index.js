const axios = require('axios');
const config = require('./config.json');
const fs = require('fs');
const urls = [
  'https://agronom.platrum.ru/wiki/api/article/list',
  'https://agronom.platrum.ru/wiki/api/article/report'
];
const articles = [];

const fetch = async (url) => {
  const response = await axios.get(url, { headers: { 'Api-key': config['Api-key'] } });
  setArticles(response.data.data);
};
fetch(urls[0]);

const setArticles = (data) => {
  // el.articles.forEach(el =>)
  data.forEach(el => articles.push(el));
  // setLinks(articles);
  console.log(articles[2]);
  // console.log(data);
};

function createFile(article) {

}
