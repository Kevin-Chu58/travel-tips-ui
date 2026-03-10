import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { imagesService, type Image } from "@services/images";
import { useEffect, useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import ImageLibrary from "@components/ImageLibrary";
import clsx from "clsx";
import "./index.scss";
import ImageForm from "@components/Forms/ImageForm";

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
  // window
  const isMobile = useIsMobile();
  // images
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | undefined>();
  // image
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // button
  const actionButtonIcon = isLoading ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AttachFileIcon />
  );

  const asyncUpdateImage = async (image: Image) => {
    let _images = [...images];
    let index = _images.findIndex((i) => i.id === image.id);
    if (index < 0) return;

    _images[index] = image;
    setImages([..._images]);
  };

  const asyncDeleteImage = async (id: number) => {
    let _images = images.filter((i) => i.id !== id);
    setImages([..._images]);
  };

  // rerender library images on openLibraryDialog
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
  }, [open]);

  const handleImageAttach = async () => {
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
            {banner ? "Banner" : "Your"} Image Library
          </Typography>
          {hasAction ? (
            <Typography className="library-dialog-secondary-text">
              Chose one to attach to the {banner ? "banner" : "trip"}
            </Typography>
          ) : undefined}
        </Box>

        <Divider variant="middle" flexItem />

        {/* image library */}
        <ImageLibrary
          images={images}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          setSelectedImage={setSelectedImage}
        />

        {/* attach button */}
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

      {/* forms */}
      {banner && !hasAction ? (
        <ImageForm
          image={selectedImage}
          onClose={() => setSelectedImage(undefined)}
          asyncUpdateImage={asyncUpdateImage}
          asyncDeleteImage={asyncDeleteImage}
          banner={banner}
        />
      ) : undefined}
    </TTDialog>
  );
};

export default LibraryDialog;
