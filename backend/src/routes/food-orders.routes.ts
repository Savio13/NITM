import express from 'express'
import prisma from '../prisma'
import { authenticate, requireRole } from '../middleware/auth'

const router = express.Router()

// Create food order (Students, Faculty)
router.post('/', authenticate, requireRole('STUDENT', 'FACULTY'), async (req, res) => {
  const { items, date, pickupOrDelivery } = req.body
  const user = (req as any).user
  if (!items || !date) return res.status(400).json({ message: 'missing required fields' })
  try {
    const order = await prisma.booking.create({
      data: {
        type: 'FOOD_ORDER',
        userId: user.id,
        startAt: new Date(date),
        details: { items, pickupOrDelivery: pickupOrDelivery || 'pickup' },
        status: 'PENDING'
      }
    })
    return res.status(201).json(order)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to create order' })
  }
})

// List orders (canteen staff sees all pending, others see own)
router.get('/', authenticate, async (req, res) => {
  const user = (req as any).user
  try {
    if (user.role === 'CANTEEN') {
      const orders = await prisma.booking.findMany({
        where: { type: 'FOOD_ORDER' },
        orderBy: { createdAt: 'asc' }
      })
      return res.json(orders)
    }
    const orders = await prisma.booking.findMany({
      where: { type: 'FOOD_ORDER', userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return res.json(orders)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to list orders' })
  }
})

// Update order status (canteen staff)
router.put('/:id', authenticate, requireRole('CANTEEN', 'ADMIN'), async (req, res) => {
  const id = req.params.id
  const { status } = req.body
  try {
    const order = await prisma.booking.findUnique({ where: { id } })
    if (!order) return res.status(404).json({ message: 'not found' })
    if (order.type !== 'FOOD_ORDER') return res.status(400).json({ message: 'not a food order' })
    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    })
    return res.json(updated)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to update order' })
  }
})

export default router
