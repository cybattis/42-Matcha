import { ReactNode } from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export function LinkButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Button
      size="xs"
      variant="subtle"
      cursor={"pointer"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Link to={href}>{children}</Link>
    </Button>
  );
}
