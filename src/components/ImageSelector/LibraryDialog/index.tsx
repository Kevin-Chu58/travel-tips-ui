import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ImagesService, type Image } from "@services/images";
import { useEffect, useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { tripsService } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type LibraryDialogProps = {
  open: boolean;
  onClose: () => void;
  imageIds: number[];
  tripId?: number;
  syncAddImage: (state: Image) => void;
};

const LibraryDialog = ({
  open,
  onClose,
  imageIds,
  tripId,
  syncAddImage,
}: LibraryDialogProps) => {
  // window
  const isMobile = useIsMobile();
  // images
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | undefined>();
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // button
  const actionButtonIcon = isLoading ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AttachFileIcon />
  );
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender library images on openLibraryDialog
  useEffect(() => {
    const initLibraryImages = async () => {
      if (open && token) {
        let imageViewModels = await ImagesService.getMyImages(token);
        let unattachedImages = imageViewModels.filter(
          (image) => !imageIds.includes(image.id)
        );
        setImages(unattachedImages);
      }
    };
    initLibraryImages();
  }, [open]);

  const handleImageAttach = async () => {
    if (tripId && selectedImageId && token) {
      try {
        setIsLoading(true);

        let newImage = await tripsService.postTripImage(
          tripId,
          selectedImageId,
          token
        );

        syncAddImage(newImage);

        enqueueSnackbar("Successfully attached image.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
      BehaviorUtils.sleep();

      // close the dialog
      handleClose();
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedImageId(undefined);
  };

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className={clsx("library-dialog-box", isMobile && "mobile")}>
        {/* header - library dialog */}
        <Box className="library-dialog-header-box">
          <Typography className="library-dialog-primary-text">
            Your Image Library
          </Typography>
          <Typography className="library-dialog-secondary-text">
            Choose one to attach to the trip
          </Typography>
        </Box>

        <Divider variant="middle" flexItem />

        {/* image library */}
        {images.length > 0 ? (
          <Box className="library-dialog-image-library">
            {images.map((image) => (
              <Box
                key={image.id}
                className={clsx(
                  "library-dialog-image-container",
                  image.id === selectedImageId && "focus"
                )}
                onClick={() => setSelectedImageId(image.id)}
              >
                <Box className="library-dialog-image-box">
                  <img
                    src={image.url}
                    className="library-dialog-image"
                    loading="lazy"
                  />
                </Box>

                {/* name */}
                {image.name && (
                  <Typography className="library-dialog-image-name">
                    {image.name}
                  </Typography>
                )}

                {/* guid */}
                <Typography className="library-dialog-image-guid">
                  {image.guid}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="library-dialog-no-image-box">
            <Typography>No images found.</Typography>
          </Box>
        )}

        {/* attach button */}
        <Box className="library-dialog-button-box">
          <TTButton
            className="library-dialog-attach-button"
            startIcon={actionButtonIcon}
            onClick={handleImageAttach}
            disabled={!Boolean(selectedImageId) || isLoading}
            color="primary"
          >
            Attach
          </TTButton>
        </Box>
      </Box>
    </TTDialog>
  );
};

export default LibraryDialog;
