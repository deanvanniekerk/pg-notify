import { Container, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import type { Order, OrderPair } from "@ck-subscriber/api/src/schema";
import type React from "react";
import { useEffect, useState } from "react";
import { trpc } from "./trpc";

type Props = {
  pair: OrderPair;
};

export const OrdersTable: React.FC<Props> = ({ pair }) => {
  const utils = trpc.useUtils();

  const [orders, setOrders] = useState<Order[]>([]);

  trpc.onNewOrder.useSubscription(pair, {
    onData(order) {
      console.log("new order received", { order });
      setOrders((currOrders) => {
        return [...currOrders, order];
      });
    },
    onStarted() {
      console.log(`subscribed to new '${pair}' orders`);
    },
    onError(err) {
      console.error(err);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const load = async () => {
      console.log(`fetching existing ${pair} orders`);
      const initialOrders = await utils.getOrders.fetch(pair);
      // console.log({ initialOrders });
      setOrders(initialOrders);
    };
    load();
  }, []);

  return (
    <Container maxW="md">
      <Heading pt={4} pb={2} size="sm">
        Orders
      </Heading>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Pair</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => {
              return (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.name}</Td>
                  <Td>{order.pair}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};
