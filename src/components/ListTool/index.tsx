// import TTCard from "@components/TTCard";
import SortIcon from "@mui/icons-material/Sort";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Select,
  Typography,
  // Tooltip,
  // Typography,
  type SelectChangeEvent,
} from "@mui/material";
// import TTIconButton from "@components/TTIconButton";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import DeleteIcon from "@mui/icons-material/Delete";
import type { ListToolButton, SortType } from "@constants/Types";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ToolTip from "@components/ToolTip";
import { useIsMobile } from "@hooks/useIsMobile";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import TTDialog from "@components/TTDialog";
import React, { useState, type JSX } from "react";
import "./index.scss";

type ListToolSortProps = {
  showSort?: boolean;
  sortType?: number;
  setSortType?: (state: number) => void;
  sortTypes?: SortType[];
};

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

type ListToolProps = ListToolSortProps &
  ListToolSelectProps &
  ListToolFilterProps &
  ListToolAddProps;

const addIconMap: Record<string, JSX.Element> = {
  add: <AddIcon />,
  upload: <UploadIcon />,
};

const ListTool = ({
  // sort props
  showSort = false,
  sortType,
  setSortType,
  sortTypes,
  // add props
  addOnClick,
  addInput,
  addIcon = "add",
  addLabel,
  otherButtons,
}: // filter props
// showFilter = false,
// select props
// showSelect = false,
// selected = [],
// handlePublish,
// handleDelete,
ListToolProps) => {
  // window
  const isMobile = useIsMobile();
  // mobile more option dialog
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // others
  // const selectButtonSx = { scale: 0.9, height: 32 };

  // const isSelectedEmpty = () => selected.length === 0;

  // const displayNumSelected = () =>
  //   isSelectedEmpty()
  //     ? "No item selected"
  //     : `${selected.length} ${selected.length > 1 ? "items" : "item"} selected`;

  // sort operations

  const addSvgIcon = addIconMap[addIcon] ?? null;

  const handleSortChange = (e: SelectChangeEvent) => {
    if (setSortType) setSortType(Number.parseInt(e.target.value));
  };

  // list tool components

  const sortComponent = (
    <Select
      className="list-tool-sort-select"
      value={sortType?.toString()}
      onChange={handleSortChange}
      size="small"
    >
      {sortTypes?.map((_sortType, i) => (
        <MenuItem
          key={_sortType.label}
          value={i.toString()}
          className="list-tool-sort-select-item"
        >
          {_sortType.label}
        </MenuItem>
      ))}
    </Select>
  );

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
      <Box>
        <Box className="list-tool-dialog-section-container">
          {/* sort section */}
          <Box className="list-tool-dialog-header">
            <SortIcon />
            <Typography variant="h6">Sort</Typography>
          </Box>
          {sortComponent}

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
                  {addInput}
                </ListItemIcon>
                <ListItemText>{addLabel}</ListItemText>
              </MenuItem>
            ) : undefined}
            {/* add button */}
            {otherButtons?.map((button) => (
              <MenuItem onClick={button.onClick}>
                <ListItemIcon>
                  <button.icon />
                  {button.input}
                </ListItemIcon>
                <ListItemText>{button.label}</ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      </Box>
    </TTDialog>
  );

  return (
    <Box className="list-tool-container">
      {isMobile ? (
        <React.Fragment>
          <Box className="list-tool-button-container">
            <ToolTip title="more options" offsetY={-4}>
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
          {showSort && (
            <Box className="list-tool-sort-container">
              <SortIcon fontSize="small" />
              {sortComponent}
            </Box>
          )}
          <Box className="list-tool-button-container">
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box className="list-tool-button-content-container">
              {addOnClick ? (
                <ToolTip title={addLabel} offsetY={-4}>
                  <IconButton
                    className="list-tool-add-button"
                    size="small"
                    onClick={addOnClick}
                  >
                    {addSvgIcon}
                    {addInput}
                  </IconButton>
                </ToolTip>
              ) : undefined}
              {/** display other buttons */}
              {otherButtons?.map((button) => (
                <ToolTip title={button.label} offsetY={-4}>
                  <IconButton
                    size="small"
                    onClick={button.onClick}
                  >
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
      {/* {showFilter && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Filter"
          icon={<FilterAltIcon />}
          sx={{
            background: "white",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          filter params
        </TTCard>
      )} */}
      {/* {showSelect && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Selected"
          icon={<CheckCircleIcon />}
          sx={{
            background: "white",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              fontStyle: isSelectedEmpty() ? "italic" : "none",
            }}
          >
            {displayNumSelected()} */}

      {/* select buttons */}
      {/* //       <Box display="flex" flexWrap="wrap" mt={1}>
      //         {handlePublish && (
      //           <TTIconButton
      //             size="small"
      //             onClick={() => handlePublish(true)}
      //             sx={{ ...selectButtonSx }}
      //           >
      //             <VisibilityIcon sx={{ mr: 1 }} /> Publish
      //           </TTIconButton>
      //         )}

      //         {handlePublish && (
      //           <TTIconButton
      //             size="small"
      //             onClick={() => handlePublish(false)}
      //             sx={{ ...selectButtonSx }}
      //           >
      //             <VisibilityOffIcon sx={{ mr: 1 }} /> Unpublish
      //           </TTIconButton>
      //         )}

      //         {handleDelete && (
      //           <TTIconButton
      //             size="small"
      //             onClick={handleDelete}
      //             color="error"
      //             sx={{ ...selectButtonSx, borderColor: "error.main" }}
      //           >
      //             <DeleteIcon sx={{ mr: 1 }} /> Delete
      //           </TTIconButton>
      //         )}
      //       </Box>
      //     </Box>
      //   </TTCard>
      // )} */}
    </Box>
  );
};

export default ListTool;
