import { Box } from "@mui/material";
import ImageLibrary from "@components/ImageLibrary";
import type { Image } from "@services/images";
import { useEffect, useState } from "react";
import ImageForm from "@components/Forms/ImageForm";

type ImageProps = {
  images: Image[];
  setIsFormOpened: (state: boolean) => void;
  syncUpdateImage: (state: Image) => void;
  syncDeleteImage: (state: number) => void;
};

const Images = ({
  images,
  setIsFormOpened,
  syncUpdateImage,
  syncDeleteImage,
}: ImageProps) => {
  // image
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();

  // rerender isFormOpened by selectedImage to track image form open status
  useEffect(() => {
    setIsFormOpened(Boolean(selectedImage));
  }, [selectedImage]);

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
