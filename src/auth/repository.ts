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
