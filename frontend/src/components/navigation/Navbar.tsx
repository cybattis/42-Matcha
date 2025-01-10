import {
  Box,
  Flex,
  Button,
  MenuItem,
  Stack,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  Image
} from '@chakra-ui/react';
import {
  useColorMode,
  useColorModeValue,
} from '@/components/ui/color-mode.tsx';
import {MoonIcon, SunIcon, UserIcon} from '@/components/Icons.tsx';
import {Link, Navigate} from "@tanstack/react-router";
import {MdAccountCircle} from "react-icons/md";
import {useAuth} from "@/auth.tsx";

export function NavbarAuth() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} pr={5} pl={20} py={2}>
        <Flex justifyContent={'end'} alignItems="center" alignContent="end">
          <Box w="100%" display="flex" justifyContent={'center'} ml={10}><Link to={"/"}>MATCHA</Link></Box>
          <Stack direction={'row'}>
            <Button onClick={toggleColorMode} variant='ghost'>
              {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
            </Button>
            <Button variant="ghost" p='0' mr='2' w={'40px'} h={'40px'}>
              <Link to={'/auth/login'} className={'w-full h-full'}>
                <UserIcon>
                  <MdAccountCircle className={'user-icon'}/>
                </UserIcon>
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
            <Button onClick={toggleColorMode} variant='ghost'>
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
  const auth = useAuth();

  return (
    <MenuRoot pos='relative'>
      <MenuTrigger asChild>
        <Button variant="ghost" p='0' mr='2' w={'40px'} h={'40px'}>
          <UserIcon>
            <Image
              src="https://bit.ly/naruto-sage"
              borderRadius="full"
              boxSize="cover"
              w='100%'
              h='100%'
              alt="navigation menu"
            />
          </UserIcon>
        </Button>
      </MenuTrigger>
      <MenuContent pos="absolute" top={"56px"}>
        <MenuItem value="Profile">Profile</MenuItem>
        <MenuItem value="settings">Settings</MenuItem>
        <MenuItem value="logout" onClick={async () => {
          await auth.logout();
        }}>
          Logout
        </MenuItem>
        {!auth.isAuthenticated && <Navigate to={'/auth/login'}/>}
      </MenuContent>
    </MenuRoot>
  );
};
