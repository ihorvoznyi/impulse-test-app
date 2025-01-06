import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  cookie: {
    secret: 'insaNelyStr0nGSecret',
  },
}));
