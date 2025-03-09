import {
  Box,
  Button,
  MenuItem,
  Stack,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  Image,
  Grid,
} from "@chakra-ui/react";
import {
  useColorMode,
  useColorModeValue,
} from "@/components/ui/color-mode.tsx";
import {
  MoonIcon,
  NotificationIcon,
  SunIcon,
  UserIcon,
} from "@/components/Icons.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/auth.tsx";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Route } from "@/routes/_app/profile.edit-images.tsx";

function AppLogo() {
  return (
    <Box w="100%" display="flex" justifyContent={"center"}>
      <Link to={"/home"} preload={false}>
        MATCHA
      </Link>
    </Box>
  );
}

function DarkModeButton(props: {
  onClick: () => void;
  colorMode: string | undefined;
}) {
  return (
    <Button onClick={props.onClick} variant="ghost" w={"40px"} h={"40px"}>
      {props.colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

export function NavbarAuth() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={5} py={2}>
        <Grid templateColumns="repeat(3, 1fr)" gap="6" alignItems={"center"}>
          <Box />
          <AppLogo />
          <Stack direction={"row"} justifyContent={"end"}>
            <DarkModeButton onClick={toggleColorMode} colorMode={colorMode} />
            <Button variant="ghost" p="0" w={"40px"} h={"40px"}>
              <Link to={"/auth/login"} className={"w-full h-full"}>
                <UserIcon className={"user-icon"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </UserIcon>
              </Link>
            </Button>
          </Stack>
        </Grid>
      </Box>
    </>
  );
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={5} py={2}>
        <Grid templateColumns="repeat(3, 1fr)" gap="6" alignItems={"center"}>
          <Box />
          <AppLogo />
          <Stack direction={"row"} justifyContent={"end"}>
            <DarkModeButton onClick={toggleColorMode} colorMode={colorMode} />
            <NotificationButton />
            <NavbarMenu />
          </Stack>
        </Grid>
      </Box>
    </>
  );
}

function NotificationButton() {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" alignSelf={"center"}>
          <NotificationIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle fontWeight="medium">Notifications</PopoverTitle>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}

const NavbarMenu = () => {
  const auth = useAuth();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <MenuRoot>
      <MenuTrigger asChild position="relative">
        <Button variant="ghost" p="0" w={"40px"} h={"40px"}>
          <UserIcon>
            <Image
              src="https://bit.ly/naruto-sage"
              borderRadius="full"
              boxSize="cover"
              w="100%"
              h="100%"
              alt="navigation menu"
            />
          </UserIcon>
        </Button>
      </MenuTrigger>
      <MenuContent pos="absolute" top={"56px"} right={"12px"}>
        <MenuItem
          value="Profile"
          onClick={async () => {
            console.log("Navigate to profile");
            await navigate({ to: "/profile/me" });
          }}
        >
          Profile
        </MenuItem>
        {/*<MenuItem*/}
        {/*  value="Likes"*/}
        {/*  onClick={async () => {*/}
        {/*    await navigate({ to: "/likes" });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Likes*/}
        {/*</MenuItem>*/}
        <MenuItem
          value="Match"
          onClick={async () => {
            await navigate({ to: "/match" });
          }}
        >
          Matches
        </MenuItem>
        <MenuItem
          value="logout"
          onClick={async () => {
            await auth.logout();
            await navigate({ to: "/auth/login" });
          }}
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
