import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { IAuthContext, useAuth } from "@/auth.tsx";
import { Box, Center, Flex, VStack } from "@chakra-ui/react";
import Navbar, { NavbarAuth } from "@/components/navigation/Navbar.tsx";
import Footer from "@/components/navigation/Footer.tsx";

export interface MyRooterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRooterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <Center w="100%" h="100%">
        <VStack w="100vw">
          <p>Error 404</p>
          <Link to="/">Start Over</Link>
        </VStack>
      </Center>
    );
  },
  errorComponent: ({ error }) => {
    return (
      <Center w="100%" h="100%">
        <VStack>
          <p>Error: {error.message}</p>
          <Link to="/">Start Over</Link>
        </VStack>
      </Center>
    );
  },
});

function RootComponent() {
  const isAuth = useAuth().isAuthenticated;
  return (
    <>
      <Flex direction="column" h={"100vh"} w={"100vw"}>
        {isAuth ? <Navbar /> : <NavbarAuth />}
        <Box flexGrow="1" p={5}>
          <Outlet />
        </Box>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
        <Footer />
      </Flex>
    </>
  );
}
