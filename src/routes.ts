import { Express } from 'express';
import { getUser, registerUser } from './user/handler';
import { login, refreshToken } from './auth/handler';
import { validateInput } from './middlewares/validateInput';
import { createUserSchema } from './user/schema';
import { loginSchema } from './auth/schema';
import { deserializeToken } from './middlewares/deserializeToken';
import requiredLogin from './middlewares/requiredLogin';

export default function routes(app: Express) {
  app.post('/api/register', validateInput(createUserSchema), registerUser);
  app.post('/api/login', validateInput(loginSchema), login);
  app.get('/api/refresh', refreshToken);

  app.use(deserializeToken);
  app.use(requiredLogin);
  app.get('/api/users/:id', getUser);
}
