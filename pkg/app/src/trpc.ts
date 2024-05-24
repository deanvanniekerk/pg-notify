import type { AppRouter } from "@ck-subscriber/api/src/router";
import type { TRPCClientErrorBase } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type {
  DefaultErrorShape,
  inferRouterInputs,
  inferRouterOutputs,
} from "@trpc/server";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type RouterInputs = inferRouterInputs<AppRouter>;

export type ServerError = TRPCClientErrorBase<DefaultErrorShape>;

export const trpc = createTRPCReact<AppRouter>();
