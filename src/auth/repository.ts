import { RowDataPacket } from 'mysql2';
import pool from '../db';

export async function getUserByUsername(data: {
  username: string;
}): Promise<{ id: number; username: string; password: string } | Error> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, password from users WHERE username = ?',
      data.username,
    );
    if (!rows.length) {
      throw new Error('username or password is incorrect');
    }

    return {
      id: rows[0].id,
      username: rows[0].username,
      password: rows[0].password,
    };
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function saveTokenToDb(token: string, userId: number) {
  try {
    const [rows] = await pool.execute(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [token, userId],
    );

    console.log('save_token_to_db', rows);

    return rows;
  } catch (error: any) {
    console.log('save_token_to_db', error.message);
    return error;
  }
}

export async function getTokenByUserId(
  userId: number,
): Promise<string | Error> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT refresh_token FROM users WHERE id = ?',
      [userId],
    );
    if (!rows.length) {
      throw new Error('invalid request');
    }

    return rows[0]['refresh_token'] as string;
  } catch (error: any) {
    console.log('get_token_by_user_id', error.message);
    return error;
  }
}
