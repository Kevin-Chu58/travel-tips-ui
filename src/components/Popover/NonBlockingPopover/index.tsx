import { useState, type ReactElement } from "react";
import { Box, ClickAwayListener, Popover } from "@mui/material";
import TTIconButton from "@components/TTIconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const NonBlockingPopover = ({ children }: { children: ReactElement }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TTIconButton
        onClick={handleClick}
        sx={{ ":hover": { bgcolor: "secondary.light" } }}
      >
        <MoreVertIcon />
      </TTIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        elevation={2}
        disableEnforceFocus
        disableAutoFocus
        hideBackdrop
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box onClick={(e) => e.stopPropagation()}>
            {children}
          </Box>
        </ClickAwayListener>
      </Popover>
    </>
  );
};

export default NonBlockingPopover;
