import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { tripsService, type TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConditionalIconGroup from "@components/ConditionalIconGroup";

type TripMainProps = {
  trip: TripDetail | undefined;
  token: string | null;
  queryKey: (string | undefined)[];
};

/**
 * The general view of editing a specific trip in workshop,
 * currently has editing descrption
 * 
 * TODO - add editing image link
 */
const TripMain = ({ trip, token, queryKey }: TripMainProps) => {
  // variales
  const [description, setDescription] = useState<string | undefined>();
  // open form status
  const [editDescription, setEditDescription] = useState<boolean>(false);
  // others
  const queryClient = useQueryClient();

  /** query functions - trip.description */

  const updateTripDescription = async () => {
    const update = { description: description?.trim() };
    return await tripsService.patchTrip(Number(trip!.id), update, token!);
  };

  const mutationTripDescription = useMutation({
    mutationFn: updateTripDescription,
    onMutate: () => {
      const previousTrip = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        description: description,
      }));

      return { previousTrip };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTrip)
        queryClient.setQueryData(queryKey, context.previousTrip);
    },

    onSuccess: (latestTrip) => {
      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        description: latestTrip.description,
      }))
    }
  });

  /** useEffect */

  // rerender on trip description
  useEffect(() => {
    if (trip?.description) setDescription(trip.description);
  }, [trip?.description]);

  /** edit description */

  const handleUpdateDescription = async () => {
    setEditDescription(false);

    if (token && trip && isNewDescriptionValid()) {
      mutationTripDescription.mutate();
    } else {
      setDescription(description?.trim());
    }
  };

  const isNewDescriptionValid = () => {
    if (!description) return true;

    let input = description?.trim();
    return input.length <= 500 && input !== trip?.description;
  };

  return (
    // Description
    <Grid size={12} pt={2}>
      <Grid size={12} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h5">Description</Typography>
        {editDescription ? (
          <ConditionalIconGroup
            onClose={() => setEditDescription(false)}
            onConfirm={handleUpdateDescription}
          />
        ) : (
          <IconButton size="small" onClick={() => setEditDescription(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Grid>
      {editDescription ? (
        <TextField
          color="primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
        />
      ) : (
        <Typography variant="body1" whiteSpace="pre-line" mt={1}>
          {description}
        </Typography>
      )}
    </Grid>
  );
};

export default TripMain;