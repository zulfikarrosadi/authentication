import { Request, Response } from 'express';
import ApiResponse from '../schema';
import { getUserByUsername } from './repository';
import { compare } from 'bcrypt';
import {
  accessTokenMaxAge,
  createNewToken,
  refreshTokenMaxAge,
  verifyToken,
} from '../utils/token';

export async function login(
  req: Request<{ username: string; password: string }>,
  res: Response<ApiResponse>,
) {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername({ username });
    if (user instanceof Error) {
      throw new Error(user.message);
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('username or password is incorrect');
    }

    const accessToken = createNewToken({
      username: user.username,
      userId: user.id,
      expiration: accessTokenMaxAge,
    });
    const refreshToken = createNewToken({
      username: user.username,
      userId: user.id,
      expiration: refreshTokenMaxAge,
    });

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: accessTokenMaxAge,
      })
      .cookie('refreshToken', refreshToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: refreshTokenMaxAge,
        path: '/api/refresh',
      })
      .json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
          },
        },
      });
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ status: 'fail', errors: { code: 400, message: error.message } });
  }
}

export async function refreshToken(req: Request, res: Response<ApiResponse>) {
  try {
    console.log('refresh hit');

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error('refresh token cookie unavailable');
    }
    const { decodedData } = verifyToken(refreshToken);
    if (!decodedData) {
      throw new Error('invalid refresh token signature');
    }
    const newAccessToken = createNewToken({
      userId: decodedData.userId,
      username: decodedData.username,
      expiration: accessTokenMaxAge,
    });
    return res
      .status(200)
      .cookie('accessToken', newAccessToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: accessTokenMaxAge,
      })
      .cookie('refreshToken', refreshToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: refreshTokenMaxAge,
        path: '/api/refresh',
      })
      .json({
        status: 'success',
        data: {
          user: {
            id: decodedData.userId,
            username: decodedData.username,
          },
        },
      });
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ status: 'fail', errors: { code: 400, message: error.message } });
  }
}
