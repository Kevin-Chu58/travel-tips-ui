import TTChipButton from "@components/TTChipButton";
import type { ChipOwnProps } from "@mui/material/Chip";
import type { JSX } from "react";
import clsx from "clsx";

type NavButtonProps = {
  link?: string;
  icon?: JSX.Element;
  label?: string;
  color?: ChipOwnProps["color"];
  className?: string;
  hovered?: boolean;
  children?: any;
};

const NavButton = ({
  link,
  icon,
  label,
  color,
  className,
  hovered = false,
  children,
}: NavButtonProps) => {
  const content = children ?? (
    <TTChipButton
      className={clsx(className, hovered && "hovered")}
      color={color}
      icon={icon}
      label={label}
    />
  );

  return (
    <a
      className={className}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </a>
  );
};

export default NavButton;
