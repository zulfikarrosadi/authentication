import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.listen(port, () => {
  routes(app);
  console.info(`Server running at port ${port}`);
});
