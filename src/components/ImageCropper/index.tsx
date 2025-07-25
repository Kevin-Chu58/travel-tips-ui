import { Box, Button, Dialog, Slider, TextField } from "@mui/material";
import Cropper, { type Area } from "react-easy-crop";
import { ImageUtils } from "@utils/ImageUtils";
import { useCallback, useState } from "react";
import "./index.scss";

type ImageCropperProps = {};

const ImageCropper = ({}: ImageCropperProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await ImageUtils.getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      console.log("Cropped Image Base64:", croppedImage);
      // You could now upload `croppedImage` or preview it
    } catch (e) {
      console.error("Crop failed", e);
    }
  };

  return (
    <>
      <TextField
        type="file"
        slotProps={{
          input: {
            accept: "image/*",
            multiple: false,
          } as any,
        }}
        onChange={handleFileChange}
      />
      <Dialog
        open={!!imageSrc}
        onClose={() => setImageSrc(null)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{p: 0}}>
          <Box sx={{ position: "relative", height: 400}}>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={6 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={true}
              />
            )}
          </Box>
          <Button variant="contained" onClick={handleCrop}>
            Crop
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default ImageCropper;
