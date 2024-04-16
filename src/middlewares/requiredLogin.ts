import { NextFunction, Request, Response } from 'express';

export default async function requiredLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!res.locals.user) {
    return res.sendStatus(401);
  }

  return next();
}
