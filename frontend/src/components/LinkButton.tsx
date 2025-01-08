import {ReactNode} from "react";
import {Button} from "@chakra-ui/react";

export function LinkButton({children, href}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Button
      size='xs'
      variant="subtle"
      cursor={'pointer'}
      as={'a'}
      href={href}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {children}
    </Button>
  );
}