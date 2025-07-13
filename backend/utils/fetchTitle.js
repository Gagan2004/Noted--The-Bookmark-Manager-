const axios = require('axios');
const cheerio = require('cheerio');

async function fetchTitleFromURL(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $('title').text();
    return title || null;
  } catch (error) {
    console.error('Error fetching title:', error.message);
    return null;
  }
}

module.exports = fetchTitleFromURL;
