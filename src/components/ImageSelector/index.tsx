import React, { useRef, useState, type ReactNode } from "react";
import "cropperjs/dist/cropper.css";
import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { enqueueSnackbar } from "notistack";
import LibraryDialog from "./LibraryDialog";
import CropperDialog from "./CropperDialog";
import "./index.scss";

type ImageSelectorProps = {
  tripId?: number;
  imageIds: number[];
  disabled?: boolean;
  setIsParentUpdated?: () => void;
  children: ReactNode;
};

const ImageSelector = ({
  tripId,
  imageIds,
  disabled = false,
  setIsParentUpdated,
  children,
}: ImageSelectorProps) => {
  // popover
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  // dialog
  const [openLibraryDialog, setOpenLibraryDialog] = useState<boolean>(false);
  const [openCropperDialog, setOpenCropperDialog] = useState<boolean>(false);
  // cropper image
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOpenCropperDialog(true);
      handleClosePopover();
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // popover
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled)
      enqueueSnackbar("You can only attach up to 4 images to a trip.", {
        variant: "error",
      });
    else setPopoverAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
  };

  // dialog
  const handleClickLibraryDialog = () => {
    setOpenLibraryDialog(true);
    handleClosePopover();
  };

  const handleCloseLibraryDialog = () => {
    setOpenLibraryDialog(false);
  };

  const handleCloseCropperDialog = () => {
    setOpenCropperDialog(false);
    setImageSrc(null);
  };

  return (
    <React.Fragment>
      <Button
        className="image-selector-file-select-button"
        size="small"
        disableRipple
        onClick={handleClickPopover}
      >
        {children}
      </Button>

      <Popover
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(popoverAnchorEl)}
        onClose={handleClosePopover}
      >
        <List>
          {/* button - library  */}
          <ListItemButton onClick={handleClickLibraryDialog}>
            <ListItemIcon className="image-selector-list-item-icon">
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Select From Library" />
          </ListItemButton>

          {/* button - upload  */}
          <ListItemButton onClick={openFileDialog}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="image-selector-cropper-file-input"
              onChange={handleFileChange}
            />
            <ListItemIcon className="image-selector-list-item-icon">
              <FileUploadIcon />
            </ListItemIcon>
            <ListItemText primary="Upload From Device" />
          </ListItemButton>
        </List>
      </Popover>

      {/* dialog - library */}
      <LibraryDialog
        open={openLibraryDialog}
        onClose={handleCloseLibraryDialog}
        imageIds={imageIds}
        tripId={tripId}
        setIsParentUpdated={setIsParentUpdated}
      />

      {/* dialog - cropper */}
      <CropperDialog
        open={openCropperDialog}
        onClose={handleCloseCropperDialog}
        imageSrc={imageSrc}
        tripId={tripId}
        setIsParentUpdated={setIsParentUpdated}
      />
    </React.Fragment>
  );
};

export default ImageSelector;
