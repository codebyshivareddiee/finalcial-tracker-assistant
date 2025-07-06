import { defineConfig } from "drizzle-kit";
import 'dotenv/config'; // Ensure environment variables are loaded

export default defineConfig({
  out: "./db/migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
});
