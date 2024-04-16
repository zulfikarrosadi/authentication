import { verify, sign, JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

/**
 * 10 minutes in ms
 */
export const accessTokenMaxAge = 600000;
/**
 * 10 days in ms
 */
export const refreshTokenMaxAge = 864000000;
const tokenSecret = process.env.TOKEN_SECRET as string;
type decodedType = JwtPayload & { userId: number; username: string };

export function verifyToken(token: string): {
  decodedData: decodedType | null;
} {
  try {
    const decoded = verify(token, tokenSecret, {
      algorithms: ['HS256'],
    }) as decodedType;

    return { decodedData: decoded };
  } catch (error: any) {
    console.log('catch the error: ', error);

    console.log(error.message);
    return { decodedData: null };
  }
}

export function createNewToken(data: {
  username: string;
  userId: number;
  expiration: number;
}) {
  const token = sign(
    { tokenId: Math.random(), username: data.username, userId: data.userId },
    tokenSecret,
    {
      algorithm: 'HS256',
      expiresIn: data.expiration,
    },
  );
  return token;
}
