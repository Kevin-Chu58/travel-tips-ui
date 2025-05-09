import { Link } from "@mui/material";

type HeaderProps = {
  name: string;
  color?: string;
  toUpperCase?: boolean;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const Header = ({
  name,
  color = "#fff",
  toUpperCase = true,
  to,
  onClick,
}: HeaderProps) => {
  return (
    <Link
      className="app-bar-header"
      href={to}
      onClick={onClick}
      variant="h6"
      m={{ xs: 1, sm: 1.5, md: 2 }}
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
