import {Outlet, createFileRoute} from '@tanstack/react-router';
import {Box, Flex} from '@chakra-ui/react';
import {NavbarAuth} from "@/components/navigation/Navbar.tsx";
import Footer from "@/components/navigation/Footer.tsx";

export const Route = createFileRoute('/auth')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <Flex direction="column" h={'100vh'} w={'100vw'}>
      <NavbarAuth/>
      <Box flexGrow="1" py={5}>
        <Outlet/>
      </Box>
      <Footer/>
    </Flex>
  );
}
