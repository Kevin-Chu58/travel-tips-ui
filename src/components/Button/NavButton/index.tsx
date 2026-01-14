import TTChipButton from "@components/TTChipButton";
import type { ChipOwnProps } from "@mui/material/Chip";
import type { JSX } from "react";
import clsx from "clsx";

type NavButtonProps = {
  link?: string;
  icon?: JSX.Element;
  deleteIcon?: JSX.Element;
  label?: string;
  color?: ChipOwnProps["color"];
  size?: ChipOwnProps["size"];
  className?: string;
  hovered?: boolean;
  children?: any;
};

const NavButton = ({
  link,
  icon,
  deleteIcon,
  label,
  color,
  size = "medium",
  className,
  hovered = false,
  children,
}: NavButtonProps) => {
  const content = children ?? (
    <TTChipButton
      className={clsx(className, hovered && "hovered")}
      size={size}
      color={color}
      label={label}
      icon={icon}
      deleteIcon={deleteIcon}
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
