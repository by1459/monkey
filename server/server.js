const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173' // allow your Vite dev server origin; change or use true for all origins
}))

app.get('/test', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})