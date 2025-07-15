import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { type Highlight } from "@services/highlights";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import HighlightForm from "@components/Forms/HighlightForm";

type HighlightItemProps = {
  highlight: Highlight;
  isLast?: boolean;
  onDelete?: (state: number) => void;
};

const HighlightItem = ({
  highlight,
  isLast = false,
  onDelete = () => {},
}: HighlightItemProps) => {
  // highlight
  const [_highlight, _setHighlight] = useState<Highlight>(highlight);
  // options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openOptions = Boolean(anchorEl);
  // edit
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // others
  const userId = useSelector((state: RootState) => state.user.id);
  const isOwner = userId === _highlight.createdBy?.id;

  // render to set description
  useEffect(() => {
    if (_highlight.description) setDescription(_highlight.description);
  }, [_highlight]);

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOptionClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    document
      .getElementById(_highlight.id.toString())
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    onDelete(highlight.id);
    setAnchorEl(null);
  };

  const menuOptions = [
    {
      label: "Edit",
      onClick: handleEditClick,
      condition: isOwner,
    },
    {
      label: "Delete",
      onClick: handleDeleteClick,
      condition: isOwner,
      sx: {
        color: "red",
      },
    },
  ];

  return (
    <React.Fragment>
      <Box
        id={highlight.id.toString()}
        display="flex"
        flexDirection="row"
        gap={2}
        py={1}
      >
        <Avatar alt={_highlight.createdBy?.toString()} src={""} />

        <Box flex={1} display="flex" flexDirection="row">
          <Box flex={1}>
            {/* user name */}
            <Typography fontSize="1rem" color="dimgrey">
              {_highlight.createdBy?.username}
            </Typography>
            {/* description */}
            {isEditing ? (
              <HighlightForm
                highlight={_highlight}
                setHighlight={_setHighlight}
                onClose={() => setIsEditing(false)}
              />
            ) : (
              <Typography whiteSpace="pre-wrap">{description}</Typography>
            )}
          </Box>
          <Box>
            {!isEditing && (
              <IconButton
                size="small"
                onClick={handleOptionsClick}
                sx={{ ml: "auto" }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
      {!isLast && <Divider flexItem />}

      {/* menu- options */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={openOptions}
        onClose={handleOptionClose}
      >
        {menuOptions.map((option) => (
          <MenuItem
            key={option.label}
            onClick={option.onClick}
            sx={{
              width: 120,
              display: option.condition ? "flex" : "none",
              ...option.sx,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default HighlightItem;
