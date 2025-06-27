import { Link, type LinkProps, type SxProps } from "@mui/material";
import "./index.scss";

type HeaderProps = {
  name: string;
  color?: string;
  toUpperCase?: boolean;
  to?: string;
  variant?: LinkProps['variant'],
  sx?: SxProps, 
  extraClassName?: string,
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const Header = ({
  name,
  color = "#fff",
  toUpperCase = true,
  to,
  variant = "h6",
  sx,
  extraClassName,
  onClick,
}: HeaderProps) => {
  return (
    <Link
      className={`app-bar-header ${extraClassName}`}
      href={to}
      onClick={onClick}
      variant={variant}
      m={{ xs: 1, sm: 1.5, md: 2 }}
      color={color}
      sx={{
        ...sx,
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
