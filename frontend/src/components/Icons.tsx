import {Icon} from '@chakra-ui/react';
import {MdDarkMode, MdLightMode} from "react-icons/md";

export function MoonIcon() {
  return (
    <Icon aria-label="Dark mode" fontSize="xl">
      <MdDarkMode/>
    </Icon>
  );
}

export function SunIcon() {
  return (
    <Icon aria-label="Light mode" fontSize="xl">
      <MdLightMode/>
    </Icon>
  );
}
