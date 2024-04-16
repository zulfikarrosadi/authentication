import { RowDataPacket } from 'mysql2';
import pool from '../db';

export async function createUser(data: { username: string; password: string }) {
  try {
    const [rows] = await pool.execute(
      'INSERT INTO users (username, password) VALUES(?, ?)',
      [data.username, data.password],
    );
    return rows;
  } catch (error: any) {
    console.log(error);
    if (error.errno === 1062) {
      return new Error('this username is already taken');
    }
    return error;
  }
}

export async function getUserById(data: {
  userId: number;
}): Promise<{ id: number; username: string } | Error> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username from users WHERE id = ?',
      data.userId,
    );
    if (!rows.length) {
      throw new Error('user not found');
    }

    return {
      id: rows[0].id,
      username: rows[0].username,
    };
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
