import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app  = express()
const db   = new PrismaClient()
const PORT = process.env.PORT ?? 4000

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',').map(s => s.trim()).filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, same-origin in prod)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json())

const VALID_TRADING  = new Set(['crypto', 'stocks', 'both'])
const VALID_REFERRAL = new Set(['twitter', 'instagram', 'tiktok', 'youtube', 'reddit', 'friend', 'google', 'other'])

// ── POST /signup ───────────────────────────────────────────────────────────────
app.post('/signup', async (req, res) => {
  const { name, email, trading_type, referral_source } = req.body ?? {}

  if (!name?.trim())                          return res.status(400).json({ error: 'Name is required' })
  if (!email?.trim())                         return res.status(400).json({ error: 'Email is required' })
  if (!VALID_TRADING.has(trading_type))       return res.status(400).json({ error: 'Invalid trading type' })
  if (!VALID_REFERRAL.has(referral_source))   return res.status(400).json({ error: 'Invalid referral source' })

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const signup = await db.signup.create({
      data: {
        name:            name.trim(),
        email:           email.trim().toLowerCase(),
        trading_type,
        referral_source,
      },
    })
    return res.status(201).json({ ok: true, id: signup.id })
  } catch (err: any) {
    // Unique constraint — already signed up
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'This email is already on the list!' })
    }
    console.error(err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// ── GET /signups (admin) ───────────────────────────────────────────────────────
app.get('/signups', async (req, res) => {
  const key = req.headers['x-admin-key']
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const signups = await db.signup.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json({ count: signups.length, signups })
})

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Waitlist API running on port ${PORT}`)
})
