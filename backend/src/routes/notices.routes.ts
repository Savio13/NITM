import express from 'express'
import prisma from '../prisma'
import { authenticate, requireRole } from '../middleware/auth'

const router = express.Router()

// Create notice (Admin/Faculty only)
router.post('/', authenticate, requireRole('ADMIN', 'FACULTY'), async (req, res) => {
  const { title, body, visibility, expiresAt } = req.body
  const user = (req as any).user
  if (!title || !body) return res.status(400).json({ message: 'missing required fields' })
  try {
    const notice = await prisma.notice.create({
      data: {
        title,
        body,
        postedById: user.id,
        visibility: visibility || 'all',
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })
    return res.status(201).json(notice)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to create notice' })
  }
})

// List notices (all authenticated users)
router.get('/', authenticate, async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      where: {
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return res.json(notices)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to list notices' })
  }
})

// Get notice by id
router.get('/:id', authenticate, async (req, res) => {
  const id = req.params.id
  try {
    const notice = await prisma.notice.findUnique({ where: { id } })
    if (!notice) return res.status(404).json({ message: 'not found' })
    return res.json(notice)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to get notice' })
  }
})

// Update notice (Admin/author only)
router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id
  const user = (req as any).user
  const { title, body, visibility } = req.body
  try {
    const notice = await prisma.notice.findUnique({ where: { id } })
    if (!notice) return res.status(404).json({ message: 'not found' })
    if (notice.postedById !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'forbidden' })
    }
    const updated = await prisma.notice.update({
      where: { id },
      data: { title: title || notice.title, body: body || notice.body, visibility: visibility || notice.visibility }
    })
    return res.json(updated)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to update notice' })
  }
})

// Delete notice (Admin/author only)
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id
  const user = (req as any).user
  try {
    const notice = await prisma.notice.findUnique({ where: { id } })
    if (!notice) return res.status(404).json({ message: 'not found' })
    if (notice.postedById !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'forbidden' })
    }
    await prisma.notice.delete({ where: { id } })
    return res.json({ ok: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ message: 'failed to delete notice' })
  }
})

export default router
