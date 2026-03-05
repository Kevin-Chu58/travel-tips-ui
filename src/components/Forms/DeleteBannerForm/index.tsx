import { Box, CircularProgress, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { enqueueSnackbar } from "notistack";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { bannersService } from "@services/feed/banners";
import { useState } from "react";
import "./index.scss";

type DeleteBannerFormProps = {
  open: number | undefined;
  onClose: () => void;
  asyncDeleteBanner: (state: number) => void;
};

const DeleteBannerForm = ({
  open,
  onClose,
  asyncDeleteBanner,
}: DeleteBannerFormProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteIcon = isDeleting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <DeleteIcon />
  );

  const handleDeleteClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleDeleteConfirm = async () => {
    if (!open) return;

    try {
      setIsDeleting(true);

      await bannersService.deleteBanner(open);

      BehaviorUtils.sleep();

      setIsDeleting(false);
      asyncDeleteBanner(open);

      enqueueSnackbar("Banner deleted.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    setIsDeleting(false);
    onClose();
  };

  return (
    <TTDialog open={Boolean(open)} onClose={onClose}>
      <Box className="delete-banner-form-header-box">
        <WarningIcon color="error" />
        <Typography className="delete-banner-form-header" color="error">
          Permanent Action
        </Typography>
      </Box>
      <Typography>Are you sure you want to delete Banner?</Typography>
      <Box className="delete-banner-form-button-box">
        <TTButton
          label="cancel"
          variant="text"
          color="error"
          onClick={handleDeleteClose}
        />
        <TTButton
          label="confirm"
          color="error"
          startIcon={deleteIcon}
          onClick={handleDeleteConfirm}
        />
      </Box>
    </TTDialog>
  );
};

export default DeleteBannerForm;
