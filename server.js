// const express = require('express')
// const app = express()
// const connectDB=require('../backend/model/config')
// const port = 3000
// const cors=require('cors')
// const Shorten = require('./model/shorten');
// const indexRoutes=require('./router/index')


// app.use(express.json())
// app.use(cors())
// app.use('/api',indexRoutes)

// connectDB()

// app.get('/:shortendUrl', async (req, res) => {
//   try {
//     const record = await Shorten.findOne({ shortendUrl: req.params.shortendUrl });
//     if (!record) return res.status(404).send('Short URL not found');
//     res.redirect(record.originUrl);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const express = require('express')
const app = express()
const connectDB = require('../backend/model/config')
const port = 3000
const cors = require('cors')
const Shorten = require('./model/shorten')
const indexRoutes = require('./router/index')

// Connect DB first
connectDB()

// Middleware
app.use(express.json())

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

// API routes
app.use('/api', indexRoutes)

// Short URL redirect (SAFE)
app.get('/s/:shortendUrl', async (req, res) => {
  try {
    const record = await Shorten.findOne({ shortendUrl: req.params.shortendUrl })
    if (!record) return res.status(404).send('Short URL not found')

    return res.redirect(301, record.originUrl)
  } catch (error) {
    return res.status(500).send('Server error')
  }
})

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
)
