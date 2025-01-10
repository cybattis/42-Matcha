import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/router-devtools';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import type {QueryClient} from '@tanstack/react-query';
import {IAuthContext} from "@/auth.tsx";
import {Box, Center, VStack} from "@chakra-ui/react";

export interface MyRooterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRooterContext>()({
    component: RootComponent,
    notFoundComponent: () => {
      return (
        <Box w='100vw' h='100%'>
          <VStack w='100vw'>
            <p>Error 404</p>
            <Link to="/">Start Over</Link>
          </VStack>
        </Box>
      );
    },
    errorComponent: ({error}) => {
      return (
        <Center w='100vw' h='100%'>
          <VStack>
            <p>Error: {error.message}</p>
            <Link to="/">Start Over</Link>
          </VStack>
        </Center>
      );
    },
  }
);

function RootComponent() {

  return (
    <>
      <Outlet/>
      <ReactQueryDevtools buttonPosition="bottom-left"/>
      <TanStackRouterDevtools position="bottom-right"/>
    </>
  );
}
