import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import {
  Box,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useCallback, useMemo, useRef, useState } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import { useIsMobile } from "@hooks/useIsMobile";
import { enqueueSnackbar } from "notistack";
import { type Image } from "@services/images";
import { ImageUtils } from "@utils/ImageUtils";
import { ImageType } from "@constants/Enums";
import clsx from "clsx";
import "./index.scss";

type CropperDialogProps = {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCrop?: (blob: Blob, dataUrl: string) => void;
  asyncAddImage?: (state: number) => void;
  setImage?: (state: Image) => void;
  imageType?: ImageType;
  identifier?: number;
  notify?: boolean;
};

const CropperDialog = ({
  open,
  onClose,
  imageSrc = null,
  onCrop,
  asyncAddImage,
  setImage,
  imageType,
  identifier,
  notify = true,
}: CropperDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cropperRef = useRef<ReactCropperElement>(null);

  const actionButtonIcon = useMemo(
    () =>
      isLoading ? (
        <CircularProgress size="1rem" sx={{ color: "white" }} />
      ) : (
        <FileUploadIcon />
      ),
    [isLoading],
  );

  const handleClose = useCallback(() => {
    onClose();
    setPreview(null);
    setName("");
  }, [onClose]);

  const handlePreview = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;
    setPreview(canvas.toDataURL("image/jpeg"));
  }, []);

  const handleCrop = useCallback(async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    if (name.length > 50) {
      enqueueSnackbar("Name is too long.", { variant: "error" });
      return;
    }

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const fileFromBlob = new File([blob], "cropped.jpg", {
          type: "image/jpeg",
        });
        const compressedBlob =
          imageType === ImageType.Banner
            ? await ImageUtils.compressImage(fileFromBlob, 1)
            : await ImageUtils.compressImage(fileFromBlob);

        if (onCrop) {
          const dataUrl = URL.createObjectURL(compressedBlob);
          onCrop(compressedBlob, dataUrl);
          handleClose();
          return;
        }

        await ImageUtils.uploadImage(
          name,
          compressedBlob,
          setIsLoading,
          asyncAddImage,
          setImage,
          imageType,
          identifier,
          notify,
        );

        handleClose();
        setIsLoading(false);
      },
      "image/jpeg",
      0.7,
    );
  }, [
    name,
    onCrop,
    asyncAddImage,
    setImage,
    imageType,
    identifier,
    notify,
    handleClose,
  ]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setName(e.target.value);
    },
    [],
  );

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className={clsx("cropper-dialog-box", isMobile && "mobile")}>
        <Box>
          <Cropper
            ref={cropperRef}
            src={imageSrc ?? undefined}
            className="cropper-dialog-cropper"
            aspectRatio={6 / 5}
            viewMode={1}
            guides={true}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            crop={handlePreview}
          />
        </Box>
        <Box
          className={clsx(
            "cropper-dialog-image-form-box",
            isMobile && "mobile",
          )}
        >
          <Box>
            <Typography className="cropper-dialog-primary-text">
              Name
            </Typography>
            <Typography className="cropper-dialog-secondary-text">
              Name is optional — you can skip it.
            </Typography>
            <FormControl variant="outlined">
              <OutlinedInput
                className="cropper-dialog-name-input"
                size="small"
                value={name}
                placeholder="optional"
                onChange={handleNameChange}
                endAdornment={`${name.length}/50`}
                autoFocus
              />
            </FormControl>

            <Typography className="cropper-dialog-primary-text">
              Preview
            </Typography>
            <Typography className="cropper-dialog-secondary-text">
              Preview updates automatically as you adjust the crop.
              <br />
              *All images are converted to jpeg format.
            </Typography>

            <Box className="cropper-dialog-image-preview-box">
              {preview && (
                <img
                  className="cropper-dialog-image-preview"
                  src={preview}
                  alt="Preview"
                />
              )}
            </Box>

            <Box className="cropper-dialog-button-box">
              <TTButton
                label="cancel"
                color="primary"
                variant="text"
                onClick={handleClose}
                disabled={isLoading}
              />
              <TTButton
                startIcon={actionButtonIcon}
                label={isLoading ? "uploading" : "submit"}
                color="primary"
                onClick={handleCrop}
                disabled={isLoading}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </TTDialog>
  );
};

export default CropperDialog;
