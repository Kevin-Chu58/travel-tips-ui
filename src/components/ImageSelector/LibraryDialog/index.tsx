import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { imagesService, type Image } from "@services/images";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import ImageLibrary from "@components/ImageLibrary";
import ImageForm from "@components/Forms/ImageForm";
import clsx from "clsx";
import "./index.scss";

type LibraryDialogProps = {
  open: boolean;
  onClose: () => void;
  imageIds?: number[];
  asyncAddImage?: (state: number) => void;
  setImage?: (state: Image) => void;
  banner?: boolean;
  hasAction?: boolean;
};

const LibraryDialog = ({
  open,
  onClose,
  imageIds = [],
  asyncAddImage,
  setImage,
  banner = false,
  hasAction = true,
}: LibraryDialogProps) => {
  const isMobile = useIsMobile();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | undefined>();
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const actionButtonIcon = useMemo(
    () =>
      isLoading ? (
        <CircularProgress size="1rem" sx={{ color: "white" }} />
      ) : (
        <AttachFileIcon />
      ),
    [isLoading],
  );

  useEffect(() => {
    const initLibraryImages = async () => {
      if (open) {
        let imageViewModels = banner
          ? await imagesService.getBannerImages()
          : await imagesService.getMyImages();
        let unattachedImages = imageViewModels.filter(
          (image) => !imageIds.includes(image.id),
        );
        setImages(unattachedImages);
      }
    };
    initLibraryImages();
  }, [open, banner, imageIds]);

  const asyncUpdateImage = useCallback((image: Image) => {
    setImages((prev) => {
      const index = prev.findIndex((i) => i.id === image.id);
      if (index < 0) return prev;
      const updated = [...prev];
      updated[index] = image;
      return updated;
    });
  }, []);

  const asyncDeleteImage = useCallback((id: number) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setSelectedImageId(undefined);
  }, [onClose]);

  const handleImageAttach = useCallback(async () => {
    if (selectedImageId) {
      try {
        setIsLoading(true);
        if (asyncAddImage) asyncAddImage(selectedImageId);
        if (setImage) {
          let image = images.find((i) => i.id === selectedImageId);
          setImage(image!);
        }
        enqueueSnackbar("Successfully attached image.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
      BehaviorUtils.sleep();
      handleClose();
      setIsLoading(false);
    }
  }, [selectedImageId, asyncAddImage, setImage, images, handleClose]);

  const handleCloseImageForm = useCallback(
    () => setSelectedImage(undefined),
    [],
  );

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className={clsx("library-dialog-box", isMobile && "mobile")}>
        <Box className="library-dialog-header-box">
          <Typography className="library-dialog-primary-text">
            {banner ? "Banner" : "Your"} Image Library
          </Typography>
          {hasAction ? (
            <Typography className="library-dialog-secondary-text">
              Chose one to attach to the {banner ? "banner" : "trip"}
            </Typography>
          ) : undefined}
        </Box>

        <Divider variant="middle" flexItem />

        <ImageLibrary
          images={images}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          setSelectedImage={setSelectedImage}
        />

        {hasAction ? (
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
        ) : undefined}
      </Box>

      {banner && !hasAction ? (
        <ImageForm
          image={selectedImage}
          onClose={handleCloseImageForm}
          asyncUpdateImage={asyncUpdateImage}
          asyncDeleteImage={asyncDeleteImage}
          banner={banner}
        />
      ) : undefined}
    </TTDialog>
  );
};

export default LibraryDialog;
