import { Box, CircularProgress, Typography } from "@mui/material";
import ImageLibrary from "@components/ImageLibrary";
import type { Image } from "@services/images";
import { useState } from "react";
import ImageForm from "@components/Forms/ImageForm";
import TTButton from "@components/TTButton";

type ImageProps = {
  images: Image[];
  cursor?: string;
  getMore: () => void;
  asyncUpdateImage: (state: Image) => void;
  asyncDeleteImage: (state: number) => void;
  isLoading: boolean;
};

const Images = ({
  images,
  cursor,
  getMore,
  asyncUpdateImage,
  asyncDeleteImage,
  isLoading,
}: ImageProps) => {
  // image
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();

  if (isLoading) {
    return (
      <Box className="column center v-center flex">
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  return (
    <Box>
      {images.length > 0 ? (
        <ImageLibrary
          images={images}
          selectedImageId={selectedImage?.id}
          setSelectedImage={setSelectedImage}
        />
      ) : (
        !isLoading && <Typography variant="h6">No images found.</Typography>
      )}
      {isLoading ? (
        <Box className="column center v-center flex">
          <CircularProgress aria-label="Loading…" />
        </Box>
      ) : (
        cursor && (
          <Box className="row center">
            <TTButton color="utility" onClick={getMore} disableRipple>
              Show More
            </TTButton>
          </Box>
        )
      )}
      <ImageForm
        image={selectedImage}
        onClose={() => setSelectedImage(undefined)}
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDeleteImage}
      />
    </Box>
  );
};

export default Images;
