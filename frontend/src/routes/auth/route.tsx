import {Outlet, createFileRoute} from '@tanstack/react-router';
import Footer from '@/components/Footer.tsx';
import {NavbarAuth} from '@/components/Navbar.tsx';
import {Box, Flex} from '@chakra-ui/react';

export const Route = createFileRoute('/auth')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <Flex direction="column" h={'100vh'} w={'100vw'}>
      <NavbarAuth/>
      <Box flexGrow="1" p={5}>
        <Outlet/>
      </Box>
      <Footer/>
    </Flex>
  );
}
