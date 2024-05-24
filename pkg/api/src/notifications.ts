import createSubscriber from "pg-listen";
import { Order, type OrderPair } from "./schema.js";
import type { EventEmitter } from "node:events";

export const getNewOrderEventName = (pair: OrderPair) => `onNewOrder-${pair}`;

export const listenForNotifications = async (ee: EventEmitter) => {
  const subscriber = createSubscriber({
    host: "localhost",
    port: 6782,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });

  subscriber.notifications.on("new_order", (payload) => {
    // Payload as passed to subscriber.notify() (see below)
    console.log("Received notification in 'new_order':", payload);
    const order = Order.parse(payload);

    ee.emit(getNewOrderEventName(order.pair), order);
  });

  await subscriber.connect();
  await subscriber.listenTo("new_order");
  console.log("Listening for pg 'new_order' notifications...");
};
