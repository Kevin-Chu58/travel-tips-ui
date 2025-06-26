import { Menu } from "@mui/material";
import type { ReactNode } from "react";

type userMenuProps = {
  anchor: HTMLElement | null | undefined;
  onClose: () => void;
  children: ReactNode;
};

const UserMenu = ({ anchor, onClose, children }: userMenuProps) => {
  return (
    <Menu
      className="app-bar-user-menu"
      anchorEl={anchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(anchor)}
      onClose={onClose}
      transitionDuration={0}
      sx={{
        mt: 1
      }}
    >
      {children}
    </Menu>
  );
};

export default UserMenu;
