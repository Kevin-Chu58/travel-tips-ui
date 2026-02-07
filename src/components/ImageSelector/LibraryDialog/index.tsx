import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ImagesService, type Image } from "@services/images";
import { useEffect, useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import ImageLibrary from "@components/ImageLibrary";
import clsx from "clsx";
import "./index.scss";

type LibraryDialogProps = {
  open: boolean;
  onClose: () => void;
  imageIds: number[];
  asyncAddImage: (state: number) => void;
};

const LibraryDialog = ({
  open,
  onClose,
  imageIds,
  asyncAddImage,
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

  // rerender library images on openLibraryDialog
  useEffect(() => {
    const initLibraryImages = async () => {
      if (open) {
        let imageViewModels = await ImagesService.getMyImages();
        let unattachedImages = imageViewModels.filter(
          (image) => !imageIds.includes(image.id),
        );
        setImages(unattachedImages);
      }
    };
    initLibraryImages();
  }, [open]);

  const handleImageAttach = async () => {
    if (selectedImageId) {
      try {
        setIsLoading(true);

        asyncAddImage(selectedImageId);

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
        <ImageLibrary
          images={images}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
        />

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
