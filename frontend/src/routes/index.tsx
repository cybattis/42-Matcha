import {
  createFileRoute,
  ParsedLocation,
  redirect,
} from "@tanstack/react-router";
import { MyRooterContext } from "./__root";
import { VStack, Image, Flex, HStack, Button } from "@chakra-ui/react";
import { LikeIcon, SkipIcon } from "@/components/Icons.tsx";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async ({
    context,
    location,
  }: {
    context: MyRooterContext;
    location: ParsedLocation;
  }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
    console.log("User is authenticated");
    throw redirect({
      to: "/app/profile-creation",
      search: {
        redirect: location.href,
      },
    });
  },
  loader: () => loader(),
});

async function loader() {}

function Index() {
  return (
    <VStack justifyContent={"center"}>
      <Flex justifyContent={"center"} direction={"column"}>
        <Image
          src="https://wallpapercave.com/uwp/uwp4261619.png"
          alt="Naruto vs Sasuke"
          aspectRatio={4 / 5}
          width="md"
        />
        <HStack gap={20} justifyContent={"center"}>
          <Button variant={"ghost"}>
            <SkipIcon />
          </Button>
          <Button variant={"ghost"}>
            <LikeIcon />
          </Button>
        </HStack>
      </Flex>
    </VStack>
  );
}
