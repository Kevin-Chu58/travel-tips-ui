import imageCompression from "browser-image-compression";

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.05, // Target max size in MB (e.g. 0.05 = 50KB)
    maxWidthOrHeight: 800, // Optional: Resize image if needed
    useWebWorker: true, // Speed boost
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};

export const ImageUtils = {
  compressImage,
};
