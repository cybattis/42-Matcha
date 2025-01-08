import {Outlet, createFileRoute, redirect} from '@tanstack/react-router';
import {isAuthenticated} from '@/lib/auth.ts';
import Footer from '@/components/Footer.tsx';
import Navbar from '@/components/Navbar.tsx';
import {Box, Container, Flex} from '@chakra-ui/react';

export const Route = createFileRoute('/app')({
  component: LayoutComponent,
  beforeLoad: async ({location}) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/auth/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
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
