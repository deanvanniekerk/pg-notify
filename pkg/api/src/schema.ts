import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { orders, orderPairsArray } from "@ck-subscriber/db/dist/schema.js";

export type Order = z.infer<typeof Order>;
export const Order = createSelectSchema(orders);

export type OrderPair = z.infer<typeof OrderPair>;
export const OrderPair = z.enum(orderPairsArray);
