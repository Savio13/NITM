import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import bookingsRoutes from './routes/bookings.routes'
import noticesRoutes from './routes/notices.routes'
import foodOrdersRoutes from './routes/food-orders.routes'
import { authenticate } from './middleware/auth'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'NITM backend running' })
})

app.use('/auth', authRoutes)

// sample protected route
app.get('/me', authenticate, (req, res) => {
  return res.json({ user: (req as any).user })
})

app.use('/bookings', bookingsRoutes)
app.use('/notices', noticesRoutes)
app.use('/food-orders', foodOrdersRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`)
})
