import { Box } from "@mui/material";
import ImageLibrary from "@components/ImageLibrary";
import type { Image } from "@services/images";
import { useState } from "react";
import ImageForm from "@components/Forms/ImageForm";

type ImageProps = {
  images: Image[];
  asyncUpdateImage: (state: Image) => void;
  asyncDeleteImage: (state: number) => void;
};

const Images = ({
  images,
  asyncUpdateImage,
  asyncDeleteImage,
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
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDeleteImage}
      />
    </Box>
  );
};

export default Images;
