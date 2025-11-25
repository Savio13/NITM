import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../prisma'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'missing fields' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ message: 'user exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: role || 'STUDENT' } })
  return res.json({ id: user.id, email: user.email, name: user.name, role: user.role })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'missing fields' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'invalid credentials' })

  const access = signAccessToken({ userId: user.id, role: user.role })
  const refresh = signRefreshToken({ userId: user.id })

  // store hashed refresh token
  const refreshHash = await bcrypt.hash(refresh, 10)
  await prisma.refreshToken.create({ data: { tokenHash: refreshHash, userId: user.id } })

  return res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'missing refresh token' })
  try {
    const payload: any = verifyRefreshToken(refreshToken)
    const tokens = await prisma.refreshToken.findMany({ where: { userId: payload.userId, revoked: false } })
    // find matching stored hash
    let found = null as any
    for (const t of tokens) {
      const ok = await bcrypt.compare(refreshToken, t.tokenHash)
      if (ok) { found = t; break }
    }
    if (!found) return res.status(401).json({ message: 'invalid refresh token' })

    // issue new access token
    const access = signAccessToken({ userId: payload.userId })
    return res.json({ accessToken: access })
  } catch (err) {
    return res.status(401).json({ message: 'invalid refresh token' })
  }
})

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'missing refresh token' })
  try {
    const payload: any = verifyRefreshToken(refreshToken)
    const tokens = await prisma.refreshToken.findMany({ where: { userId: payload.userId, revoked: false } })
    for (const t of tokens) {
      const ok = await bcrypt.compare(refreshToken, t.tokenHash)
      if (ok) {
        await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } })
        break
      }
    }
    return res.json({ ok: true })
  } catch (err) {
    return res.status(400).json({ message: 'invalid token' })
  }
})

export default router
