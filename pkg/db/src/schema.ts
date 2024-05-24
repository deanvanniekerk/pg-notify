import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const orderPairsArray = ["sol-btc", "sol-usd", "sol-eth"] as const;

// declaring enum in database
export const orderPairEnum = pgEnum("orderpair", orderPairsArray);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  pair: orderPairEnum("pair").notNull(),
});
