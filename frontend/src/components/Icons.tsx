import {Icon} from '@chakra-ui/react';
import {MdDarkMode, MdLightMode} from "react-icons/md";
import {ReactNode} from "react";

export function MoonIcon() {
  return (
    <Icon aria-label="Dark mode" className={'dark-mode-button'}>
      <MdDarkMode/>
    </Icon>
  );
}

export function SunIcon() {
  return (
    <Icon aria-label="Light mode" className={'dark-mode-button'}>
      <MdLightMode/>
    </Icon>
  );
}

export function UserIcon({children}: { children: ReactNode }) {
  return (
    <Icon aria-label="user icon" className={''}>
      {children}
    </Icon>
  );
}