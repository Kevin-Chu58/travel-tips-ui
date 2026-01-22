import {
  Avatar,
  Box,
  Chip,
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
import { useIsMobile } from "@hooks/useIsMobile";
import MarkdownBox from "@components/MarkdownBox";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import clsx from "clsx";
import "./index.scss";

type HighlightItemProps = {
  highlight: Highlight;
  showMenu?: boolean;
  isLast?: boolean;
  onUpdate?: (state?: Highlight) => void;
  onDelete?: (state: number) => void;
  onDetach?: () => void; // detach highlight from tao
  readonly?: boolean;
  showRef?: boolean;
};

const HighlightItem = ({
  highlight,
  showMenu = true,
  isLast = false,
  onUpdate,
  onDelete,
  onDetach,
  readonly = false,
  showRef = false,
}: HighlightItemProps) => {
  // windows
  const isMobile = useIsMobile();
  // highlight
  const [_highlight, _setHighlight] = useState<Highlight | undefined>();
  // options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openOptions = Boolean(anchorEl);
  // edit
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // others
  const userId = useSelector((state: RootState) => state.user.id);
  const isOwner = userId === _highlight?.createdBy?.id;

  // render to set description
  useEffect(() => {
    if (highlight) {
      _setHighlight(highlight);
      setDescription(highlight.description ?? "");
    }
  }, [highlight.id, highlight.description]);

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOptionClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (_highlight) {
      setIsEditing(true);
      document
        .getElementById(_highlight.id.toString())
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setAnchorEl(null);
    }
  };

  const handleDetachClick = () => {
    if (onDetach) {
      onDetach();
      setAnchorEl(null);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(highlight.id);
      setAnchorEl(null);
    }
  };

  // default options: edit, delete
  const menuOptions = [
    {
      label: "Edit",
      onClick: handleEditClick,
      condition: isOwner,
    },
    {
      label: "Detach",
      onClick: handleDetachClick,
      condition: onDetach,
    },
    {
      label: "Delete",
      onClick: handleDeleteClick,
      condition: onDelete && isOwner,
      sx: {
        color: "red",
      },
    },
  ];

  const highlightDescription = (
    <MarkdownBox text={description || "*Nothing to preview*"} disableGap />
  );

  const highlightForm = (
    <HighlightForm
      highlight={_highlight}
      setHighlight={_setHighlight}
      onAction={onUpdate}
      onClose={() => setIsEditing(false)}
    />
  );

  const avatar = (
    <Avatar
      className={clsx("highlight-item-avatar", isMobile && "mobile")}
      alt={_highlight?.createdBy?.toString()}
      src={""}
    />
  );

  const username = (
    <Typography className="highlight-item-username">
      {_highlight?.createdBy?.username}
    </Typography>
  );

  const menuIconButton = !readonly && showMenu && !isEditing && (
    <IconButton
      className="highlight-item-edit-icon"
      size="small"
      onClick={handleOptionsClick}
    >
      <MoreVertIcon fontSize="small" />
    </IconButton>
  );

  const UsageCountChip =
    showRef && highlight.usageCount > 0 ? (
      <Box>
        <Chip
          color="info"
          sx={{ fontWeight: "bold" }}
          icon={<LinearScaleIcon sx={{ transform: "rotate(180deg)" }} />}
          label={`${highlight.usageCount} Ref${
            highlight.usageCount > 1 ? "s" : ""
          }`}
        />
      </Box>
    ) : undefined;

  return (
    <React.Fragment>
      <Box
        id={highlight.id.toString()}
        className={clsx("highlight-item-box", isMobile && "mobile")}
      >
        {!isMobile ? (
          <React.Fragment>
            {avatar}

            <Box className="highlight-item-content-box">
              {/* header */}
              <Box className="highlight-item-content-header-box">
                {/* user name */}
                {username}
                {/* description */}
                {isEditing ? (
                  <React.Fragment>{highlightForm}</React.Fragment>
                ) : (
                  <React.Fragment>
                    {highlightDescription}
                    <Box>{UsageCountChip}</Box>
                  </React.Fragment>
                )}
              </Box>
              <Box>{menuIconButton}</Box>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box display="flex" alignItems="center" gap={1}>
              {avatar}
              {username}
              <Box ml="auto">{menuIconButton}</Box>
            </Box>
            {isEditing ? (
              <React.Fragment>{highlightForm}</React.Fragment>
            ) : (
              <React.Fragment>{highlightDescription}</React.Fragment>
            )}
            {UsageCountChip}
          </React.Fragment>
        )}
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
            className={`highlight-item-menu-item ${
              !option.condition && "hidden"
            }`}
            onClick={option.onClick}
            sx={{
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
