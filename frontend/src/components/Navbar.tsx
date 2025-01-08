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
import {Link, useNavigate} from "@tanstack/react-router";
import {MdAccountCircle} from "react-icons/md";

export function NavbarAuth() {
  const {colorMode, toggleColorMode} = useColorMode();
  const navigate = useNavigate();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} pr={2} pl={20} py={2}>
        <Flex justifyContent={'end'} alignItems="center" alignContent="end">
          <Box w="100%" display="flex" justifyContent={'center'} ml={10}><Link to={"/"}>MATCHA</Link></Box>
          <Stack direction={'row'}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
            </Button>
            <Button variant="ghost" p='0' width={50}>
              <Link to={'/auth/login'} className={'w-full h-full'}>
                <MdAccountCircle className={'w-full h-full'}/>
              </Link>
            </Button>
          </Stack>
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
          <Box w="100%" display="flex" justifyContent={'center'}><Link to={"/"}>MATCHA</Link></Box>
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
