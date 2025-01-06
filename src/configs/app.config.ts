import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  http: {
    port: +process.env.HTTP_PORT || 3000,
    host: process.env.HTTP_HOST,
  },
}));
