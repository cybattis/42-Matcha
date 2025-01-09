import {Outlet, createFileRoute, redirect, useNavigate} from '@tanstack/react-router';
import {Box, Flex} from '@chakra-ui/react';
import Navbar from "@/components/navigation/Navbar.tsx";
import {MyRooterContext} from "@/routes/__root.tsx";
import Footer from "@/components/navigation/Footer.tsx";

export const Route = createFileRoute('/app')({
  component: LayoutComponent,
  beforeLoad: ({context, location}: { context: MyRooterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
});

function LayoutComponent() {
  return (
    <Flex direction="column" h={'100vh'} w={'100vw'}>
      <Navbar/>
      <Box flexGrow="1">
        <Outlet/>
      </Box>
      <Footer/>
    </Flex>
  );
}
