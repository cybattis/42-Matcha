import {
  Box,
  Flex,
  Button,
  MenuItem,
  useDisclosure,
  Stack,
  Center,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuSeparator,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import {ReactNode} from 'react';
import {
  useColorMode,
  useColorModeValue,
} from '@/components/ui/color-mode.tsx';
import {MoonIcon, SunIcon} from '@/components/Icons.tsx';
import {useNavigate} from "@tanstack/react-router";

export function NavbarAuth() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={20} py={2}>
        <Flex justifyContent={'end'} alignItems="center" alignContent="end">
          <Box w="100%" display="flex" justifyContent={'center'}>MATCHA</Box>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
          </Button>
        </Flex>
      </Box>
    </>
  );
}


export default function Navbar() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} pl={20} pr={5} py={2}>
        <Flex justifyContent={'end'} alignItems="center" alignContent="end">
          <Box></Box>
          <Box w="100%" display="flex" justifyContent={'center'}>MATCHA</Box>
          <Stack direction={'row'}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
            </Button>
            <NavbarMenu/>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}

export const NavbarMenu = () => {
  const navigate = useNavigate();
  return (
    <MenuRoot>
      <MenuTrigger asChild pos="relative">
        <Button variant="outline" size="md">
          Open
        </Button>
      </MenuTrigger>
      <MenuContent pos="absolute">
        <MenuItem value="Profile">Profile</MenuItem>
        <MenuItem value="settings">Settings</MenuItem>
        <MenuItem value="logout" onClick={() => {
          localStorage.removeItem('token');
          navigate({
            to: '/',
          }).then(r => console.log(r));
        }}>Logout</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
