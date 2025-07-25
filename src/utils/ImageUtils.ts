import type { Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // required for cross-origin images
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, crop: Area): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas.toDataURL("image/jpeg");
};

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
  getCroppedImg,
  compressImage,
};
