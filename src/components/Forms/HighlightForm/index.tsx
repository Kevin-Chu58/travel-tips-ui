import {
  Box,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import {
  attractionsService,
  type Attraction,
  type AttractionPatch,
} from "@services/attractions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type HighlightFormProps = {
  highlight: Attraction | undefined;
  open: boolean;
  setOpen: (state: Attraction | undefined) => void;
  setIsParentUpdated?: () => void;
};

const HighlightForm = ({
  highlight,
  open,
  setOpen,
  setIsParentUpdated,
}: HighlightFormProps) => {
  // attributes
  const [description, setDescription] = useState<string>();
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on highlight to init attributes
  useEffect(() => {
    if (highlight) {
      setDescription(highlight.description);
    }
  }, [highlight]);

  const handleUpdate = async () => {
    const isChanged = description !== highlight?.description;

    if (isChanged && token && highlight) {
      await attractionsService.patchHighlight(
        highlight.id,
        { ...highlight, description } as AttractionPatch,
        token
      );
      handleClose();
      if (setIsParentUpdated) setIsParentUpdated();
    }
  };

  const handleClose = () => {
    setOpen(undefined);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Grid container direction="column" size={12} p={1} px={3} pb={2}>
        <Grid container size={12} display="flex" alignItems="center" mb={4}>
          <Typography variant="h5" fontWeight="bold">
            Edit Highlight
          </Typography>
          <Box ml="auto">
            <IconButton disableRipple color="error" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <IconButton disableRipple color="success" onClick={handleUpdate}>
              <CheckIcon />
            </IconButton>
          </Box>
        </Grid>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
        />
      </Grid>
    </Dialog>
  );
};

export default HighlightForm;
