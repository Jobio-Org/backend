import { SeedPg } from '@snaplet/seed/adapter-pg';
import { defineConfig } from '@snaplet/seed/config';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: 'config/.env' });

export default defineConfig({
  adapter: async () => {
    const client = new Client(process.env.DB_URL);
    await client.connect();
    return new SeedPg(client);
  },
  select: ['!*', 'public.*'],
});
