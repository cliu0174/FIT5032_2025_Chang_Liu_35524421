import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Echo endpoint - 支持GET和POST
app.get('/api/echo', (req, res) => {
  res.json({
    ok: true,
    type: 'echo',
    received: req.query,
    method: 'GET',
    ts: new Date().toISOString()
  })
})

app.post('/api/echo', (req, res) => {
  res.json({
    ok: true,
    type: 'echo',
    received: req.body,
    method: 'POST',
    ts: new Date().toISOString()
  })
})

// Summary endpoint
app.post('/api/summary', (req, res) => {
  const { numbers } = req.body

  if (!Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'Body must be { numbers: number[] }'
    })
  }

  const count = numbers.length
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  const sum = numbers.reduce((a, b) => a + b, 0)
  const avg = sum / count

  res.json({
    ok: true,
    type: 'summary',
    count, min, max, avg,
    ts: new Date().toISOString()
  })
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Dev API server: http://localhost:${PORT}`)
})
