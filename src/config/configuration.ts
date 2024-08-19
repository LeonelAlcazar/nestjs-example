import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationTime: process.env.JWT_EXPIRATION_TIME,
  },
  bcrypt: {
    saltOrRounds: parseInt(process.env.BCRYPT_SALT_OR_ROUNDS, 10),
  },
  defaults: {
    operator: {
      email: process.env.DEFAULT_OPERATOR_EMAIL,
      password: process.env.DEFAULT_OPERATOR_PASSWORD,
    },
  },
}));
