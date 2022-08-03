const config = require('./config.json');
const urls = [
  'https://agronom.platrum.ru/wiki/api/article/list',
  'https://agronom.platrum.ru/wiki/api/article/report'
];
const url = urls[0];
const axios = require('axios');
const articles = [];
const links = [];

const fetch = async (url) => {
  const response = await axios.get(url, { headers: { 'Api-key': config['Api-key'] } });
  setArticles(response.data.data);
  console.log(response.data.data);
};
fetch(url);

const setArticles = (data) => {
  // el.articles.forEach(el =>)
  data.forEach(el => articles.push(el));
  // setLinks(articles);
  console.log(articles[0]);
  // console.log(data);
};


// const setLinks = (data) => {
//   data.forEach(el => {
//     links.push(`${el['article_id']}-${el.slug}`);
//   })
//   console.log(links);
// }
