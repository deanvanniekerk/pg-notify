import type { EventEmitter } from "node:events";
import * as schema from "@ck-subscriber/db/dist/schema.js";
import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getNewOrderEventName } from "./notifications.js";
import { Order, OrderPair } from "./schema.js";

const t = initTRPC.create();

const client = postgres({
  host: "localhost",
  port: 6782,
  user: "postgres",
  password: "postgres",
  database: "postgres",
});
const db = drizzle(client, { schema });

export const appRouter = (ee: EventEmitter) => {
  return t.router({
    onNewOrder: t.procedure.input(OrderPair).subscription(({ input }) => {
      // return an `observable` with a callback which is triggered immediately
      return observable<Order>((emit) => {
        const onNewOrder = (data: Order) => {
          // emit data to client
          emit.next(data);
        };

        const eventName = getNewOrderEventName(input);
        // trigger onNewOrder when `newOrder` is triggered in our event emitter
        ee.on(eventName, onNewOrder);
        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ee.off(eventName, onNewOrder);
        };
      });
    }),
    getOrders: t.procedure.input(OrderPair).query(async ({ input }) => {
      const ordersQuery = db.query.orders.findMany({
        where: (order, { eq }) => eq(order.pair, input),
        orderBy: (order, { desc }) => [desc(order.id)],
      });
      // console.log("orders query\n", ordersQuery.toSQL());
      const orders = await ordersQuery.execute();
      return orders.map((o) => Order.parse(o));
    }),
  });
};

export type AppRouter = Awaited<ReturnType<typeof appRouter>>;
