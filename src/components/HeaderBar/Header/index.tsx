import { Link, type LinkProps } from "@mui/material";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type HeaderProps = {
  name: string;
  className?: string;
  color?: string;
  toUpperCase?: boolean;
  to?: string;
  variant?: LinkProps["variant"];
  auth?: boolean;
  enableHighlight?: boolean;
  focus?: boolean;
  hasLimit?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const Header = ({
  name,
  className,
  color = "#fff",
  toUpperCase = true,
  to,
  variant = "h6",
  auth = false,
  enableHighlight = false,
  hasLimit = false,
  focus = false,
  onClick,
}: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <Link
      className={clsx(
        "app-bar-header",
        isMobile && "mobile",
        auth && "auth",
        enableHighlight && "enable-highlight",
        hasLimit && "hasLimit",
        focus && "focus",
        className,
      )}
      href={to}
      onClick={onClick}
      variant={variant}
      m={{ xs: 1, sm: 1.5, md: 2.3 }}
      color={color}
      sx={{
        ":hover": {
          ":after": {
            borderColor: color,
          },
        },
      }}
    >
      {toUpperCase ? name.toUpperCase() : name}
    </Link>
  );
};

export default Header;
