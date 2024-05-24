import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { OrderPair } from "@ck-subscriber/api/src/schema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWSClient, wsLink } from "@trpc/client";
import { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import { trpc } from "./trpc";

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: "ws://localhost:7272",
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

function App() {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
    }),
  );

  const params = new URLSearchParams(window.location.search);
  const pair = OrderPair.parse(params.get("pair") ?? "sol-btc");

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraBaseProvider theme={theme}>
          <OrdersTable pair={pair} />
        </ChakraBaseProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
