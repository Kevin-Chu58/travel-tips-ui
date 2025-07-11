import { getHex } from "@constants/Colors";
import { mild_box_shadow_lg } from "@constants/Shadows";
import { Box, darken, Dialog, IconButton, Typography, type DialogProps } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from "react";

type TTDialogProps = {
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  children: ReactNode;
};

const TTDialog = ({
  maxWidth = "md",
  open,
  onClose,
  children,
}: TTDialogProps) => {
  return (
    <Dialog maxWidth={maxWidth} open={open} onClose={onClose}>
      <Box>
        {/* title bar */}
        <Box
          height={40}
          display="flex"
          position="relative"
          alignItems="center"
          sx={{
            color: "lightgrey",
            bgcolor: darken(getHex("dimgrey")!, 0.7),
            boxShadow: mild_box_shadow_lg,
          }}
        >
          {/* mid side */}
          <Box mx="auto">
            <Typography>
              Highlights
            </Typography>
          </Box>

          {/* right side */}
          <Box position="absolute" right={0}>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "darkgrey",
                bgcolor: "transparent",
                ":hover": {
                  color: "lightgrey",
                },
              }}
            >
              <CloseIcon/>
            </IconButton>
          </Box>
        </Box>

        {/* content */}
        {children}
      </Box>
    </Dialog>
  );
};

export default TTDialog;
