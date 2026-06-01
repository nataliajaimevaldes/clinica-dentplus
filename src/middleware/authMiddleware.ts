import type { Request, Response, NextFunction } from 'express'
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: number
    userEmail?: string
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    next()
  } else {
    res.redirect('/login')
  }
}

export const isLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    next()
  } else {
    res.redirect('/affiliates')
  }
}
