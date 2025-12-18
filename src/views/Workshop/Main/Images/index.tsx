import { Box } from "@mui/material";
import ImageLibrary from "@components/ImageLibrary";
import type { Image } from "@services/images";
import { useState } from "react";
import ImageForm from "@components/Forms/ImageForm";

type ImageProps = {
  images: Image[];
  syncUpdateImage: (state: Image) => void;
  syncDeleteImage: (state: number) => void;
};

const Images = ({
  images,
  syncUpdateImage,
  syncDeleteImage,
}: ImageProps) => {
  // image
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();

  return (
    <Box>
      <ImageLibrary
        images={images}
        selectedImageId={selectedImage?.id}
        setSelectedImage={setSelectedImage}
      />
      <ImageForm
        image={selectedImage}
        onClose={() => setSelectedImage(undefined)}
        syncUpdateImage={syncUpdateImage}
        syncDeleteImage={syncDeleteImage}
      />
    </Box>
  );
};

export default Images;
