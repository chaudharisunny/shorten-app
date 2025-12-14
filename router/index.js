// const express = require('express');
// const { nanoid } = require('nanoid');
// const Shorten = require('../model/shorten');
// const router = express.Router();



// router.post('/shorten', async (req, res) => {
//   try {
//     const { originUrl } = req.body;
//     if (!originUrl) return res.status(400).json({ error: 'URL is required' });

//     const shortendUrl = nanoid(6); // 6 char short code
//     const newUrl = new Shorten({ originUrl, shortendUrl });
//     await newUrl.save();

//    return res.json({ shortUrl: `https://localhost:${shortendUrl}` }); // change domain if needed
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.get('/:shortendUrl', async (req, res) => {
//   try {
//     const record = await Shorten.findOne({ shortendUrl: req.params.shortendUrl });
//     if (!record) return res.status(404).json({ error: 'Short URL not found' });
//     res.redirect(record.originUrl);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const { nanoid } = require('nanoid');
const Shorten = require('../model/shorten');
const validUrl = require('valid-url');

const router = express.Router();

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originUrl } = req.body;
    if (!originUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!validUrl.isUri(originUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const shortendUrl = nanoid(6);

    const newUrl = new Shorten({ originUrl, shortendUrl });
    await newUrl.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return res.json({
      shortUrl: `${baseUrl}/s/${shortendUrl}`
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
