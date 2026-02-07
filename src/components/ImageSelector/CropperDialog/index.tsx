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
import { useRef, useState } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import { useIsMobile } from "@hooks/useIsMobile";
import { enqueueSnackbar } from "notistack";
import { ImagesService } from "@services/images";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { ImageUtils } from "@utils/ImageUtils";
import clsx from "clsx";
import "./index.scss";

type CropperDialogProps = {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  asyncAddImage: (state: number) => void;
};

const CropperDialog = ({
  open,
  onClose,
  imageSrc = null,
  asyncAddImage,
}: CropperDialogProps) => {
  // window
  const isMobile = useIsMobile();
  // name
  const [name, setName] = useState<string>("");
  // cropper image
  const [preview, setPreview] = useState<string | null>(null);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const actionButtonIcon = isLoading ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <FileUploadIcon />
  );
  // ref
  const cropperRef = useRef<ReactCropperElement>(null);

  const handlePreview = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    const croppedDataUrl = canvas.toDataURL("image/jpeg");
    setPreview(croppedDataUrl); // store in state for rendering
  };

  const handleCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    if (name.length > 50) {
      enqueueSnackbar("Name is too long.", { variant: "error" });
      return;
    }

    // Convert cropped canvas to Blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Convert Blob to File
      const fileFromBlob = new File([blob], "cropped.jpg", { type: blob.type });

      try {
        // Compress image
        const compressedBlob = await ImageUtils.compressImage(fileFromBlob);
        setIsLoading(true);

        const newImage = await ImagesService.uploadImage(compressedBlob, name);

        asyncAddImage(newImage.id);

        enqueueSnackbar("Successfully uploaded image.", {
          variant: "success",
        });
      } catch (err) {
        if (err instanceof Error) {
          enqueueSnackbar(err.message, { variant: "error" });
        }
      }
      BehaviorUtils.sleep();

      // close the dialog
      handleClose();
      setIsLoading(false);
    }, "image/jpeg");
  };

  const handleNameTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setName(event.target.value);
  };

  const handleClose = () => {
    onClose();
    setPreview(null);
    setName("");
  };

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className={clsx("cropper-dialog-box", isMobile && "mobile")}>
        {/* cropper */}
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
        {/* new image form */}
        <Box
          className={clsx(
            "cropper-dialog-image-form-box",
            isMobile && "mobile",
          )}
        >
          <Box>
            {/* name */}
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
                onChange={(e) => handleNameTextFieldChange(e)}
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

            {/* image preview */}
            <Box className="cropper-dialog-image-preview-box">
              {preview && (
                <img
                  className="cropper-dialog-image-preview"
                  src={preview}
                  alt="Preview"
                />
              )}
            </Box>

            {/* upload button */}
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
