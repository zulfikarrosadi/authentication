import { createPool } from 'mysql2/promise';
import 'dotenv/config';

const connection = createPool({
  database: 'auth_ts',
  user: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
});

export default connection;
