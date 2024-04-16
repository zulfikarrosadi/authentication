import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/token';

export async function deserializeToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next();
  }

  const { decodedData: accessTokenPayload } = verifyToken(accessToken);
  if (!accessTokenPayload) {
    return next();
  }

  res.locals.user = accessTokenPayload;
  return next();
}
