import type { Config } from "drizzle-kit";

export default {
  schema: "./pkg/db/src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 6782,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  },
} satisfies Config;
