(async () => {
  const axios = require('axios');
  const request = require('request');
  const config = require('./config.json');
  const fs = require('fs');
  await (function reset() {
    fs.readdir('./build/posts/', (err, files) => {
      if (err) console.error(err);
      for (const file of files) {
        fs.unlink(`./build/posts/${file}`, (err,) => { if (err) throw err; })
      }
    });
    fs.readdir('./build/imgs/', (err, files) => {
      if (err) console.error(err);
      for (const file of files) {
        fs.unlink(`./build/imgs/${file}`, (err,) => { if (err) throw err; })
      }
    })
  })();
  const urls = [
    'https://agronom.platrum.ru/wiki/api/article/list',
    'https://agronom.platrum.ru/wiki/api/article/report',
    'https://agronom.platrum.ru/wiki/api/article/file'
  ];
  const articles = [];

  const fetch = async (url, database) => {
    const response = await axios.get(url, { headers: { 'Api-key': config['Api-key'] } });
    setArticles(response.data.data, database);
  };
  fetch(urls[0], articles);

  const setArticles = (data, database) => {
    data.forEach(el => database.push(el));
    // console.log(database[15]);
    database.forEach(el => {
      createFile(el);
    });
  };

  function createFile(article) {
    const id = article.id;
    let picNum = 1;
    const linkPath = article.slug;
    const title = article.title;
    const text = [
      `Link to the post: https://agronom.platrum.ru/wiki/page/${id}-${linkPath}`,
      `Title: ${title}`
    ];
    const contentBlocks = article['content_blocks'].map((el) => {
      return {
        content: el.content,
        type: el.type
      };
    });

    contentBlocks.forEach(el => {
      if (el.type === 'image') {

        let name = `${id}-${picNum}`;

        if (picNum === 1) {
          name = `${id}`;
        };

        picNum++;
        const url = `${urls[2]}?file_id=${el.content}&article_id=${id}&key=${config['Api-key']}`;
        fetchPhoto(url, name);

      } else {
        text.push(el.content);
      }
    });
    fs.writeFile(`./build/posts/${id}.txt`, text.join('\n'), (err) => {
      if (err) console.error(err);
    });
  }

  async function fetchPhoto(url, name) {
    request.get({
      url: url,
      encoding: 'binary',
    }, (err, response, body) => {
      if (err) return console.log(err);
      fs.writeFile(`./build/imgs/${name}.png`, body, 'binary', (err) => {
        if (err) return console.log(err);
      })
    })
  }
})()
