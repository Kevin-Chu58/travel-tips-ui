import SortIcon from "@mui/icons-material/Sort";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import type { ListToolButton } from "@constants/Types";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ToolTip from "@components/ToolTip";
import { useIsMobile } from "@hooks/useIsMobile";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import TTDialog from "@components/TTDialog";
import TTButton from "@components/TTButton";
import React, { useState, type JSX } from "react";
import "./index.scss";

type ListToolSelectProps = {
  showSelect?: boolean;
  selected?: number[];
  // button options
  handlePublish?: (state: boolean) => void;
  handleDelete?: () => void;
};

type ListToolFilterProps = {
  showFilter?: boolean;
};

type ListToolAddProps = {
  addOnClick?: () => void;
  addInput?: JSX.Element;
  addIcon?: "add" | "upload";
  addLabel?: string;
  otherButtons?: ListToolButton[];
};

type ListToolProps = ListToolSelectProps &
  ListToolFilterProps &
  ListToolAddProps;

const addIconMap: Record<string, JSX.Element> = {
  add: <AddIcon />,
  upload: <UploadIcon />,
};

const ListTool = ({
  addOnClick,
  addInput,
  addIcon = "add",
  addLabel,
  otherButtons,
}: ListToolProps) => {
  // window
  const isMobile = useIsMobile();
  // mobile more option dialog
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // others
  const hasOtherButtons = otherButtons && otherButtons.length > 0;

  // sort operations

  const addSvgIcon = addIconMap[addIcon] ?? null;

  // more option dialog

  const addOnClickInDialog = () => {
    setIsOpen(false);
    if (addOnClick) addOnClick();
  };

  const moreOptionDialog = (
    <TTDialog
      className="list-tool-dialog"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      hidePadding
    >
      <Box className="list-tool-dialog-section-container">
        {/* sort section */}
        <Box className="list-tool-dialog-header">
          <SortIcon />
          <Typography variant="h6">Sort</Typography>
          <TTButton
            className="list-tool-dialog-close-button"
            color="primary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </TTButton>
        </Box>

        <Divider />

        {/* action section */}
        <Box className="list-tool-dialog-header">
          <SettingsApplicationsIcon />
          <Typography variant="h6">Action</Typography>
        </Box>
        <MenuList>
          {/* add button */}
          {addOnClick ? (
            <MenuItem onClick={addOnClickInDialog}>
              <ListItemIcon>
                {addSvgIcon}
                <Box className="hidden">{addInput}</Box>
              </ListItemIcon>
              <ListItemText>{addLabel}</ListItemText>
            </MenuItem>
          ) : undefined}
          {/* add button */}
          {otherButtons?.map((button) => (
            <MenuItem key={button.label} onClick={button.onClick}>
              <ListItemIcon>
                <button.icon />
                {button.input}
              </ListItemIcon>
              <ListItemText>{button.label}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Box>
    </TTDialog>
  );

  return (
    <Box className="list-tool-container">
      {isMobile ? (
        <React.Fragment>
          <Box className="list-tool-button-container">
            <ToolTip title="More Options" offsetY={-4}>
              <IconButton
                className="list-tool-more-button"
                size="small"
                onClick={() => setIsOpen(true)}
              >
                <SettingsIcon />
              </IconButton>
            </ToolTip>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box className="list-tool-button-container">
            {addOnClick || hasOtherButtons ? (
              <Divider orientation="vertical" variant="middle" flexItem />
            ) : undefined}
            <Box className="list-tool-button-content-container">
              {addOnClick ? (
                <ToolTip title={addLabel} offsetY={-4}>
                  <IconButton
                    className="list-tool-add-button"
                    size="small"
                    onClick={addOnClick}
                  >
                    {addSvgIcon}
                    <Box className="hidden">{addInput}</Box>
                  </IconButton>
                </ToolTip>
              ) : undefined}
              {/** display other buttons */}
              {otherButtons?.map((button) => (
                <ToolTip key={button.label} title={button.label} offsetY={-4}>
                  <IconButton size="small" onClick={button.onClick}>
                    <button.icon />
                    {button.input}
                  </IconButton>
                </ToolTip>
              ))}
            </Box>
          </Box>
        </React.Fragment>
      )}

      {/* more option form */}
      {moreOptionDialog}
    </Box>
  );
};

export default ListTool;
