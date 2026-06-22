import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { User } from '../models/index.js'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'petcare_secret_2024',
}

export function initPassport() {
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id, '-password')
      if (!user) return done(null, false)
      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }))
}

export function autenticar(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno de autenticação.' })
    }
    if (!user) {
      return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' })
    }
    req.user = user
    next()
  })(req, res, next)
}

export function apenasAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' })
  }
  next()
}