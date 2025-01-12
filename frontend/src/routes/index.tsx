import {
  createFileRoute,
  ParsedLocation,
  redirect,
} from "@tanstack/react-router";
import { MyRooterContext } from "./__root";
import axios from "axios";
import { UserProfile } from "@/lib/interface.ts";
import { VStack, Image, Flex, HStack, Button } from "@chakra-ui/react";
import { getUserToken } from "@/auth.tsx";
import { LikeIcon, SkipIcon } from "@/components/Icons.tsx";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: ({
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
  },
  loader: () => loader(getUserToken()),
});

async function loader(token: string | null) {
  const response = await axios.get("/UserProfile/Me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data as UserProfile;
}

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
