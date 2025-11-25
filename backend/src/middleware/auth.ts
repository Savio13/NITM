import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import prisma from '../prisma'

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const payload: any = verifyAccessToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    ;(req as any).user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (allowed.length === 0) return next()
    if (!allowed.includes(user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}
