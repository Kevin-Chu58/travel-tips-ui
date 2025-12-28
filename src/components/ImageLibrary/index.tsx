import { useIsMobile } from "@hooks/useIsMobile";
import { Box, Typography } from "@mui/material";
import { type Image } from "@services/images";
import clsx from "clsx";
import React from "react";

type ImageLibraryProps = {
  images: Image[];
  selectedImageId?: number;
  setSelectedImageId?: (state: number) => void;
  setSelectedImage?: (state: Image) => void;
};

const ImageLibrary = ({
  images,
  selectedImageId,
  setSelectedImageId,
  setSelectedImage,
}: ImageLibraryProps) => {
  const isMobile = useIsMobile();

  const handleImageClick = async (image: Image) => {
    if (setSelectedImageId) setSelectedImageId(image.id);
    if (setSelectedImage) setSelectedImage(image);
  };

  return (
    <React.Fragment>
      {images.length > 0 ? (
        <Box
          className={clsx("library-dialog-image-library", isMobile && "mobile")}
        >
          {images.map((image) => (
            <Box
              key={image.id}
              className={clsx(
                "library-dialog-image-container",
                image.id === selectedImageId && "focus"
              )}
              onClick={() => handleImageClick(image)}
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
              {/* <Typography className="library-dialog-image-guid">
                {image.guid}
              </Typography> */}
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="library-dialog-no-image-box">
          <Typography>No images found.</Typography>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ImageLibrary;
