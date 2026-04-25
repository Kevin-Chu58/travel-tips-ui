import { ImageType } from "@constants/Enums";
import { imagesService, type Image } from "@services/images";
import imageCompression from "browser-image-compression";
import { enqueueSnackbar } from "notistack";

const compressImage = async (
  file: File,
  sizeMB?: number,
  widthOrHeight?: number,
): Promise<File> => {
  const options = {
    maxSizeMB: sizeMB ?? 0.2, // Target max size in MB (e.g. 0.2 = 200KB)
    maxWidthOrHeight: widthOrHeight ?? 1500, // Optional: Resize image if needed
    useWebWorker: true, // Speed boost
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const maxSizeKB = options.maxSizeMB * 1000;
    if (compressedBlob.size > maxSizeKB * 1024) {
      throw new Error(`Cropped image must be smaller than ${maxSizeKB} KB`);
    }

    return compressedBlob;
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};

const downloadImage = async (blob: Blob, filename = "image.jpeg") => {
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(objectUrl);
};

const addImagePrefix = (base64: string) => {
  return `data:image/jpeg;base64,${base64}`;
};

// API

const uploadImage = async (
  name: string,
  blob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  asyncAddImage?: (state: number) => void,
  setImage?: (state: Image) => void,
  imageType?: ImageType,
  identifier?: number,
  notify: boolean = false,
) => {
  const isBanner = imageType === ImageType.Banner;

  const fileFromBlob = new File([blob], "cropped.jpg", { type: blob.type });
  try {
    // Compress image
    const compressedBlob = isBanner
      ? await ImageUtils.compressImage(fileFromBlob, 1)
      : await ImageUtils.compressImage(fileFromBlob);
    setIsLoading(true);

    let newImage = undefined;
    switch (imageType) {
      case ImageType.Banner:
        newImage = await imagesService.uploadBannerImage(compressedBlob, name);
        break;
      case ImageType.Business:
        if (identifier)
          newImage = await imagesService.uploadBusinessImage(
            identifier,
            compressedBlob,
          );
        break;
      default:
        newImage = await imagesService.uploadImage(compressedBlob, name);
    }

    if (newImage) {
      if (asyncAddImage) asyncAddImage(newImage.id);
      if (setImage) setImage(newImage);

      if (notify) {
        enqueueSnackbar("Successfully uploaded image.", {
          variant: "success",
        });
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }
};

export const ImageUtils = {
  compressImage,
  downloadImage,
  addImagePrefix,
  // API
  uploadImage,
};
