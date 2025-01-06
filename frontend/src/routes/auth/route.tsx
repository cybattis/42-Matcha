import { Outlet, createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer.tsx';
import Navbar from "@/components/Navbar.tsx";
import {Box, Center, Container, Flex} from "@chakra-ui/react";

export const Route = createFileRoute('/auth')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <Flex direction="column" h={"100vh"} w={"100vw"}>
      <Box>
        <Navbar/>
      </Box>
      <Box flexGrow="1">
        <Outlet/>
      </Box>
      <Box>
        <Footer/>
      </Box>
    </Flex>
  )
}
