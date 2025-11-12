import TTDialog from "@components/TTDialog";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Fab,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { ImagesService, type Image } from "@services/images";
import { useIsMobile } from "@hooks/useIsMobile";
import { enqueueSnackbar } from "notistack";
import ToolTip from "@components/ToolTip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import clsx from "clsx";
import "./index.scss";

type ImageFormProps = {
  image: Image | undefined;
  onClose: () => void;
  syncUpdateImage: (state: Image) => void;
  syncDeleteImage: (state: number) => void;
  readonly?: boolean;
};

const ImageForm = ({
  image,
  onClose,
  syncUpdateImage,
  syncDeleteImage,
  readonly = false,
}: ImageFormProps) => {
  // windows
  const isMobile = useIsMobile();
  // name
  const [name, setName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  // others
  const inputRef = useRef<HTMLInputElement>(null);

  const MISSING_NAME = "*Missing Name*";

  useEffect(() => {
    if (image) {
      setName(image.name ?? "");
    } else {
      setName("");
    }
  }, [image]);

  const updateName = async () => {
    const trimmedName = name?.trim();
    const imageName = image?.name ? image.name : "";

    if (trimmedName === imageName || trimmedName.length > 50) {
      if (trimmedName.length > 50) {
        enqueueSnackbar("Trip title is too long.", { variant: "error" });
      }
      setIsEditingName(false);
      setName(image?.name ?? "");
      return;
    }

    if (image) {
      try {
        await ImagesService.updateImageName(image.id, trimmedName);

        enqueueSnackbar("Successfully updated image name.", {
          variant: "success",
        });

        setName(name);

        let updatedImage = { ...image, name: name };
        syncUpdateImage(updatedImage);
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }

      setIsEditingName(false);
    }
  };

  const deleteImage = async () => {
    if (image) {
      try {
        let imageId = await ImagesService.deleteImage(image.id);

        enqueueSnackbar("Successfully deleted image.", {
          variant: "success",
        });

        syncDeleteImage(imageId);
        handleClose();
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleNameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      updateName();
    }
  };

  const handleClose = () => {
    onClose();
    setName("");
    setIsEditingName(false);
  };

  return (
    <React.Fragment>
      {image ? (
        <TTDialog
          className="image-form-dialog"
          open={Boolean(image)}
          onClose={handleClose}
          maxWidth="lg"
          hidePadding
        >
          <Box className="image-form-content-container">
            {/* image */}
            <Box
              className={clsx(
                "image-form-image-container",
                isMobile && "mobile"
              )}
            >
              <img
                src={image?.url}
                className="image-form-image"
                loading="lazy"
              />
            </Box>

            {/* detail */}
            <Box className="image-form-detail-container">
              <Box className="image-form-name-container">
                {isEditingName ? (
                  <FormControl variant="outlined">
                    <OutlinedInput
                      className="image-form-name-input"
                      ref={inputRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      endAdornment={`${name?.length ?? 0}/50`}
                      onKeyDown={(e) => handleNameKeyDown(e)}
                      onBlur={updateName}
                      autoFocus
                      size="small"
                    />
                  </FormControl>
                ) : (
                  <Button
                    className="image-form-name-button"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Typography
                      className={clsx(
                        "image-form-name",
                        !image?.name && "no-name"
                      )}
                    >
                      {image?.name ?? MISSING_NAME} <EditIcon />
                    </Typography>
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* fabs */}
          <Box className="image-form-fab-container">
            {!readonly ? (
              <ToolTip title="Delete Image" placement="bottom">
                <Fab color="error" onClick={deleteImage} size="medium">
                  <DeleteForeverIcon />
                </Fab>
              </ToolTip>
            ) : undefined}
          </Box>
        </TTDialog>
      ) : undefined}
    </React.Fragment>
  );
};

export default ImageForm;
