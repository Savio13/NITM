import express from 'express'
import prisma from '../prisma'
import { authenticate, requireRole } from '../middleware/auth'

const router = express.Router()

// Create a booking (any authenticated user)
router.post('/', authenticate, async (req, res) => {
  const { type, itemId, startAt, endAt, details } = req.body
  const user = (req as any).user
  if (!type) return res.status(400).json({ message: 'missing type' })
  try {
    const booking = await prisma.booking.create({
      data: {
        type,
        userId: user.id,
        itemId: itemId || null,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        details: details || undefined,
        status: 'PENDING'
      }
    })
    return res.status(201).json(booking)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to create booking' })
  }
})

// Get bookings: if admin/HOD can filter, otherwise returns user's bookings
router.get('/', authenticate, async (req, res) => {
  const user = (req as any).user
  const { status } = req.query
  try {
    if (user.role === 'ADMIN' || user.role === 'HOD') {
      const where: any = {}
      if (status) where.status = String(status)
      const bookings = await prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' } })
      return res.json(bookings)
    }
    const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
    return res.json(bookings)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to list bookings' })
  }
})

// Get pending bookings (approvers)
router.get('/pending', authenticate, requireRole('HOD', 'ADMIN'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' } })
    return res.json(bookings)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to list pending bookings' })
  }
})

// Get booking by id (requester or approver)
router.get('/:id', authenticate, async (req, res) => {
  const id = req.params.id
  const user = (req as any).user
  try {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return res.status(404).json({ message: 'not found' })
    if (booking.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'HOD') {
      return res.status(403).json({ message: 'forbidden' })
    }
    return res.json(booking)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to get booking' })
  }
})

// Approve a booking (HOD or Admin)
router.post('/:id/approve', authenticate, requireRole('HOD', 'ADMIN'), async (req, res) => {
  const id = req.params.id
  const user = (req as any).user
  const { approvalNotes } = req.body
  try {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return res.status(404).json({ message: 'not found' })
    if (booking.status !== 'PENDING') return res.status(400).json({ message: 'booking not pending' })
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'APPROVED', approvedBy: user.id, approvalNotes: approvalNotes || null } })
    return res.json(updated)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to approve booking' })
  }
})

// Reject a booking (HOD or Admin)
router.post('/:id/reject', authenticate, requireRole('HOD', 'ADMIN'), async (req, res) => {
  const id = req.params.id
  const user = (req as any).user
  const { approvalNotes } = req.body
  try {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return res.status(404).json({ message: 'not found' })
    if (booking.status !== 'PENDING') return res.status(400).json({ message: 'booking not pending' })
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'REJECTED', approvedBy: user.id, approvalNotes: approvalNotes || null } })
    return res.json(updated)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to reject booking' })
  }
})

export default router
