import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { tripsService, type TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type TripMainProps = {
  tripDetail: TripDetail | undefined;
  token: string | null;
	render: () => void;
};

const TripMain = ({ tripDetail, token, render }: TripMainProps) => {
  const [description, setDescription] = useState<string | undefined>();
  const [editDescription, setEditDescription] = useState<boolean>(false);

  // rerender on trip detail and isUpdated
  useEffect(() => {
    const init = async () => {
			if (tripDetail) {
				setDescription(tripDetail?.description);
			}
		};
		init();
  }, [tripDetail]);

  // description

  const handleChangeDescripiton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleUpdateDescription = async () => {
    setEditDescription(false);

    if (token && tripDetail && isNewDescriptionValid()) {
      const update = { description: description };
      await tripsService.patchTrip(tripDetail?.id, update, token);
      render();
    } else {
      setDescription(description?.trim());
    }
  };

  const isNewDescriptionValid = () => {
    if (!description) return true;

    let input = description?.trim();
    return input.length <= 500 && input !== tripDetail?.description;
  };

  return (
    // Description
    <Grid size={12}>
      <Grid size={12} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h5">Description</Typography>
        {!editDescription && (
          <IconButton size="small" onClick={() => setEditDescription(true)}>
            <EditIcon />
          </IconButton>
        )}
        {editDescription && (
          <>
            <IconButton
              disableRipple
              color="error"
              onClick={() => setEditDescription(false)}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              disableRipple
              color="success"
              onClick={handleUpdateDescription}
            >
              <CheckIcon />
            </IconButton>
          </>
        )}
      </Grid>
      {!editDescription && (
        <Typography variant="body1" whiteSpace="pre-line" mt={1}>{description}</Typography>
      )}
      {editDescription && (
        <TextField
          color="primary"
          value={description}
          onChange={handleChangeDescripiton}
          fullWidth
          multiline
        />
      )}
    </Grid>
  );
};

export default TripMain;
