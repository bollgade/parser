(async () => {
  const axios = require('axios');
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
    createFile(articles[2])
  };

  function createFile(article) {
    const id = article.id;
    let picNum = 0;
    const linkPath = article.slug;
    const title = article.title;
    const text = [`Link to the post: https://agronom.platrum.ru/wiki/page/${id}-${linkPath}`];
    const contentBlocks = article['content_blocks'].map((el) => {
      return {
        content: el.content,
        type: el.type
      };
    });

    contentBlocks.forEach(el => {
      if (el.type === 'image') {
        // https://agronom.platrum.ru/wiki/api/article/file?file_id=9d8b66f85cd3ea8b181a6fc3ccbb2c3a&article_id=7
        if (picNum !== 0) {
          console.log(el.content);
        };
        picNum++;
        fetchPhoto(urls[2], { headers: { 'file_id': el.content, 'Api-key': config['Api-key'] } }, { data: { 'artice_id': id } });

      } else {
        text.push(el.content);
      }
    });

    fs.writeFile(`./build/posts/${id}-${title}.txt`, text.join('\n'), (err) => {
      if (err) console.error(err);
    });
  }

  async function fetchPhoto(url, headers, data) {
    const response = await axios
      .get(url, headers, data)
      .then((res, body) => {
        console.log(res);
        console.log(body);
        fs.writeFile('hello.png')
      });
  }


})()
