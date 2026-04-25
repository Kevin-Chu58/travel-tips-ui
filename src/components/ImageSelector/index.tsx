import React, { useRef, useState, type ReactNode } from "react";
import "cropperjs/dist/cropper.css";
import {
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LibraryDialog from "./LibraryDialog";
import CropperDialog from "./CropperDialog";
import type { Image } from "@services/images";
import { ImageType } from "@constants/Enums";
import "./index.scss";

type ImageSelectorProps = {
  imageIds?: number[];
  disabled?: boolean;
  onCrop?: (blob: Blob, dataUrl: string) => void;
  asyncAddImage?: (state: number) => void; // do something with the image id
  setImage?: (state: Image) => void; // do something with the image view model
  readonly?: boolean;
  imageType?: ImageType;
  identifier?: number;
  notify?: boolean;
  children: ReactNode;
};

const ImageSelector = ({
  imageIds = [],
  disabled = false,
  onCrop,
  asyncAddImage,
  setImage,
  readonly = false,
  imageType,
  identifier,
  notify = true,
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
  // others
  const isBanner = imageType === ImageType.Banner;
  const isBusiness = imageType === ImageType.Business;
  const isAd = imageType === ImageType.Ad;
  const showLibraryDialog = !(isBusiness || isAd);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOpenCropperDialog(true);
      handleClosePopover();

      // Reset so reselecting the same file works (double-click)
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // popover
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (readonly) return;

    if (!disabled) setPopoverAnchorEl(event.currentTarget);
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

      <Menu
        anchorEl={popoverAnchorEl}
        open={Boolean(popoverAnchorEl)}
        onClose={handleClosePopover}
      >
        {/* button - library  */}
        {showLibraryDialog ? (
          <MenuItem onClick={handleClickLibraryDialog}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Select From Library" />
          </MenuItem>
        ) : undefined}

        {/* button - upload  */}
        <MenuItem onClick={openFileDialog}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="image-selector-cropper-file-input"
            onChange={handleFileChange}
          />
          <ListItemIcon>
            <FileUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload From Device" />
        </MenuItem>
      </Menu>

      {/* dialog - library */}
      {showLibraryDialog ? (
        <LibraryDialog
          open={openLibraryDialog}
          onClose={handleCloseLibraryDialog}
          imageIds={imageIds}
          asyncAddImage={asyncAddImage}
          setImage={setImage}
          banner={isBanner}
        />
      ) : undefined}

      {/* dialog - cropper */}
      <CropperDialog
        open={openCropperDialog}
        onClose={handleCloseCropperDialog}
        imageSrc={imageSrc}
        onCrop={onCrop}
        asyncAddImage={asyncAddImage}
        setImage={setImage}
        imageType={imageType}
        identifier={identifier}
        notify={notify}
      />
    </React.Fragment>
  );
};

export default ImageSelector;
