import imageCompression from "browser-image-compression";

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.2, // Target max size in MB (e.g. 0.2 = 200KB)
    maxWidthOrHeight: 1500, // Optional: Resize image if needed
    useWebWorker: true, // Speed boost
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const maxSizeKB = options.maxSizeMB * 1000;
    if (compressedBlob.size > maxSizeKB * 1024) {
      throw new Error(
        `Cropped image must be smaller than ${maxSizeKB} KB`
      );
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

export const ImageUtils = {
  compressImage,
  downloadImage,
  addImagePrefix,
};
