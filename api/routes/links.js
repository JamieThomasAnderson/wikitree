// Express server
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  // Headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let allLinks = []; // moved inside this scope to avoid conflicts
  let activeRequests = 0; // Counter for active requests

  async function getLinkStructure(originLink, depth) {
    try {
      activeRequests++;
      await new Promise(resolve => setTimeout(resolve, 1));

      const response = await axios.get(originLink);
      const $ = cheerio.load(response.data);
      const links = [];

      $('p > a').each((i, link) => {
        const href = link.attribs.href;

        allLinks.push({
          originLink: originLink,
          childLink: "https://en.wikipedia.org" + href,
          dateTimeRetrieved: new Date()
        });
        links.push("https://en.wikipedia.org" + href);
      });

      // Send a new event with the latest data
      res.write(`data: ${JSON.stringify({ allLinks })}\n\n`);

      if (depth > 0) {
        for (let i = 0; i < links.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 0));
          await getLinkStructure(links[i], depth - 1);
        }
      }

    } catch (error) {
      console.error(`Failed to fetch or parse the page: ${originLink}`, error);
    } finally {
      activeRequests--;
      if (activeRequests === 0) {
        // If no more active requests, send 'done' event and close connection
        res.write(`event: done\ndata: done\n\n`);
        res.end();
      }
    }
  }

  await getLinkStructure(url, 1);
});

module.exports = router;
