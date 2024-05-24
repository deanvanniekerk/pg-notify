import { EventEmitter } from "node:events";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { listenForNotifications } from "./notifications.js";
import { appRouter } from "./router.js";

const ee = new EventEmitter();

await listenForNotifications(ee);

const initWebsockets = () => {
  const wss = new WebSocketServer({
    port: 7272,
  });

  const handler = applyWSSHandler({
    wss,
    router: appRouter(ee),
    onError: (err) => {
      console.error({
        error: {
          path: err.path,
          code: err.error.code,
          message: err.error.message,
        },
      });
      console.error(err.error.stack);
      console.error(err.error.cause);
    },
  });

  wss.on("connection", (ws) => {
    console.log(`➕➕ WS Connection (${wss.clients.size})`);
    ws.once("close", () => {
      console.log(`➖➖ WS Connection (${wss.clients.size})`);
    });
  });
  console.log("✅ WebSocket Server listening on ws://localhost:7272");

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
  });
};

initWebsockets();

// const initApi = () => {
//   const app = express();

//   const trpcBase = "/trpc";

//   app.use(
//     trpcBase,
//     trpcExpress.createExpressMiddleware({
//       router: appRouter(ee),
//       onError: (err) => {
//         console.error({
//           error: {
//             path: err.path,
//             code: err.error.code,
//             message: err.error.message,
//           },
//         });
//         console.error(err.error.stack);
//         console.error(err.error.cause);
//       },
//     }),
//   );

//   const [port, listenAddress] = [7273, "0.0.0.0"];

//   app.listen(port, listenAddress);
//   console.log(`✅ API listening on http://${listenAddress}:${port}`);
// };

// initApi();
