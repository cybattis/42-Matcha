import {
  Box,
  Flex,
  Button,
  MenuItem,
  useDisclosure,
  Stack,
  Center, MenuRoot, MenuTrigger, MenuContent, MenuSeparator, Icon, Avatar,
} from '@chakra-ui/react'
import {ReactNode} from "react";
import {useColorMode, useColorModeValue} from "@/components/ui/color-mode.tsx";
import {MoonIcon, SunIcon} from "@/components/Icons.tsx";

interface Props {
  children: ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={16}>
        <Flex justifyContent={'space-between'}>
          <Box>Logo</Box>
          <Stack direction={'row'}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <NavbarMenu />
          </Stack>
        </Flex>
      </Box>
    </>
  )
}

export const NavbarMenu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="new-txt">New Text File</MenuItem>
        <MenuItem value="new-file">New File...</MenuItem>
        <MenuItem value="new-win">New Window</MenuItem>
        <MenuItem value="open-file">Open File...</MenuItem>
        <MenuItem value="export">Export</MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}