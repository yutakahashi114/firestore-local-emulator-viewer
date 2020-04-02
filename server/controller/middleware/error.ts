import { Request, Response, NextFunction } from 'express'

export const asyncMiddleware = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err)
    next(err)
  })
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500)
  res.send({ error: err })
}
