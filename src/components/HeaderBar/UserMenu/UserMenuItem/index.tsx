import { Link } from "@mui/material";

type UserMenuItemProps = {
  name: string;
  to: string;
  focusColor: string;
  onClick?: () => void;
};

const UserMenuItem = ({ name, to, focusColor, onClick }: UserMenuItemProps) => {
  return (
    <Link
      className="app-bar-user-menu-item"
      href={to}
      onClick={onClick}
      display="block"
      width={100}
      my={1.5}
      py={0.5}
      textAlign="center"
      border="1px solid transparent"
      borderRadius={2}
      color="#fff"
      bgcolor="black"
      sx={{
        textDecoration: "none",
        boxShadow: "2px 2px 2px #00000033, 4px 4px 4px #00000033",
        ":hover": {
          bgcolor: focusColor,
        },
      }}
    >
      {name.toUpperCase()}
    </Link>
  );
};

export default UserMenuItem;
