import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret'
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXP || '15m'
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXP || '7d'

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXP })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP })
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET)
}
