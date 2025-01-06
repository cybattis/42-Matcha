import {Icon} from "@chakra-ui/react";
import {FaMoon} from "react-icons/fa";
import {IoMdSunny} from "react-icons/io";

export function MoonIcon() {
  return (
    <Icon aria-label="Search database">
      <FaMoon />
    </Icon>
  )
}

export function SunIcon() {
  return (
    <Icon aria-label="Search database">
      <IoMdSunny />
    </Icon>
  )
}

