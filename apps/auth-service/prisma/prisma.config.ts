import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: './schema.prisma',

  migrations: {
    path: './migrations',
  },

  datasource: {
    url: process.env.AUTH_DATABASE_URL,
  },
});
