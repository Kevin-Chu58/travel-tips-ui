import React, { useCallback, useRef, useState, type ReactNode } from "react";
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
  asyncAddImage?: (state: number) => void;
  setImage?: (state: Image) => void;
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
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [openLibraryDialog, setOpenLibraryDialog] = useState<boolean>(false);
  const [openCropperDialog, setOpenCropperDialog] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // these are stable — defined outside or never change
  const isBanner = imageType === ImageType.Banner;
  const isBusiness = imageType === ImageType.Business;
  const isAd = imageType === ImageType.Ad;
  const showLibraryDialog = !(isBusiness || isAd);

  const handleClosePopover = useCallback(() => {
    setPopoverAnchorEl(null);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setOpenCropperDialog(true);
        handleClosePopover();
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    },
    [handleClosePopover],
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClickPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (readonly) return;
      if (!disabled) setPopoverAnchorEl(event.currentTarget);
    },
    [readonly, disabled],
  );

  const handleClickLibraryDialog = useCallback(() => {
    setOpenLibraryDialog(true);
    handleClosePopover();
  }, [handleClosePopover]);

  const handleCloseLibraryDialog = useCallback(() => {
    setOpenLibraryDialog(false);
  }, []);

  const handleCloseCropperDialog = useCallback(() => {
    setOpenCropperDialog(false);
    setImageSrc(null);
  }, []);

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
        {showLibraryDialog ? (
          <MenuItem onClick={handleClickLibraryDialog}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Select From Library" />
          </MenuItem>
        ) : undefined}

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

      {/* ✅ conditional mount — only mount when open */}
      {openCropperDialog && (
        <CropperDialog
          open
          onClose={handleCloseCropperDialog}
          imageSrc={imageSrc}
          onCrop={onCrop}
          asyncAddImage={asyncAddImage}
          setImage={setImage}
          imageType={imageType}
          identifier={identifier}
          notify={notify}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(ImageSelector);
