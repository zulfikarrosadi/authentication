import { Request, Response } from 'express';
import { createUser, getUserById } from './repository';
import { genSalt, hash } from 'bcrypt';
import ApiResponse from '../schema';
import {
  accessTokenMaxAge,
  createNewToken,
  refreshTokenMaxAge,
} from '../utils/token';
import { saveTokenToDb } from '../auth/repository';

export async function registerUser(
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response<ApiResponse>,
) {
  const { username, password } = req.body;
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const result = await createUser({
      username: username,
      password: hashedPassword,
    });
    if (result instanceof Error) {
      throw new Error(result.message);
    }

    const user = await getUserById({ userId: result.insertId });
    if (user instanceof Error) {
      throw new Error(user.message);
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
    await saveTokenToDb(refreshToken, user.id);
    return res
      .status(201)
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

export async function getUser(
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
) {
  const { id } = req.params;
  try {
    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) {
      throw new Error('user not found');
    }

    const user = await getUserById({ userId });
    if (user instanceof Error) {
      throw new Error(user.message);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
        },
      },
    });
  } catch (error: any) {
    console.log(error.message);

    return res
      .status(400)
      .json({ status: 'fail', errors: { code: 404, message: error.message } });
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response<ApiResponse, { user: { username: string; userId: number } }>,
) {
  return res
    .status(200)
    .json({ status: 'success', data: { user: { ...res.locals.user } } });
}
