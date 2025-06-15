import {
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService } from "@services/trips";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@components/TTTextField";
import TripMain from "./TripMain";
import TripDays from "./TripDays";
import ConditionalSuccessIconGroup from "@components/ButtonGroup/ConditionalSuccessButtonGroup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layouts, { Headers } from "@constants/Layouts";
import TTIconButton from "@components/TTIconButton";
import type { NavTab } from "@constants/Types";
import TTTabs from "@components/TTTabs";

/**
 * The view of a specific trip in workshop that allows editing,
 * currently two nav tabs: General and Days
 */
const Trip = () => {
  // variables
  const [navTabValue, setNavTabValue] = useState<number>(0);
  const [name, setName] = useState<string>("");
  // open form status
  const [editName, setEditName] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { tripId } = useParams();
  const queryClient = useQueryClient();

  /** query functions - trip and trip.name */

  const getTrip = async () => {
    return await tripsService.getMyTripById(Number(tripId), token!);
  };

  const updateTripName = async () => {
    const update = { name: name.trim() };
    return await tripsService.patchTrip(Number(tripId), update, token!);
  };

  let queryKey = ["trip", tripId];

  const { data: trip } = useQuery({
    queryKey: queryKey,
    queryFn: getTrip,
    enabled: !!tripId && !!token,
    refetchOnWindowFocus: false,
  });

  const mutationTripName = useMutation({
    mutationFn: updateTripName,
    onMutate: () => {
      const previousTrip = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        name: name,
      }));

      return { previousTrip };
    },

    onError: (_err, _variables, context) => {
      // Rollback if the mutation fails
      if (context?.previousTrip) {
        queryClient.setQueryData(queryKey, context.previousTrip);
      }
    },

    onSuccess: (latestTrip) => {
      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        name: latestTrip.name,
      }));
    },
  });

  /** useEffect */

  // render the nav tab index focus when page initializes
  useEffect(() => {
    let pathname = window.location.pathname;
    let navTabIndex = navTabs.findIndex((tab) => tab.to === pathname);
    setNavTabValue(navTabIndex);
  }, []);

  // rerender on trip name
  useEffect(() => {
    if (trip?.name) setName(trip.name);
  }, [trip?.name]);

  /** edit name */

  const handleUpdateName = async () => {
    setEditName(false);

    if (token && isNewNameValid()) {
      mutationTripName.mutate();
    } else {
      setName(name.trim());
    }
  };

  const isNewNameValid = () => {
    let input = name.trim();
    return input.length > 0 && input.length <= 50 && input !== trip?.name;
  };

  /** constants */

  // nav tab
  const navTabs = [
    {
      name: "General",
      label: "General",
      to: `/workshop/trip/${tripId}`,
    },
    {
      name: "Days",
      label:
        (trip?.days?.length ?? 0) > 0 ? (
          `Days (${trip!.days!.length})`
        ) : (
          "Days"
        ),
      to: `/workshop/trip/${tripId}/days`,
    },
  ] as NavTab[];

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: "100vw",
        maxHeight: `calc(100vh - ${Headers}px)`,
        pl: 2,
        overflow: "hidden",
      }}
    >
      <Box color="black" mt={`${Layouts.WorkshopTripNameMt}px`}>
        <Grid container direction="column" spacing={2}>
          <Grid size={12}>
            {/* Name */}
            <Grid
              size={12}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Grid
                container
                height={Layouts.WorkshopTripName}
                alignItems="center"
              >
                {editName ? (
                  <>
                    <TextField
                      input={name}
                      onChange={(e) => setName(e.target.value)}
                      onEnterDown={handleUpdateName}
                      fullWidth
                      autoFocus
                      inputSx={{
                        fontSize: "2.125rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        mt: -.3,
                        p: 0,
                        height: "auto",
                      }}
                    />
                    <ConditionalSuccessIconGroup
                      size="medium"
                      onClose={() => setEditName(false)}
                      onConfirm={handleUpdateName}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      sx={{ borderBottom: "2px solid transparent" }}
                    >
                      {trip?.name}
                    </Typography>
                    <TTIconButton
                      sx={{
                        color: "secondary.main",
                        bgcolor: "secondary.900",
                        ":hover": {
                          bgcolor: "secondary.dark",
                        },
                      }}
                      onClick={() => setEditName(true)}
                    >
                      <EditIcon />
                    </TTIconButton>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  height: Layouts.WorkshopNavTab,
                }}
              >
                <TTTabs
                  navTabValue={navTabValue}
                  navTabs={navTabs}
                  setNavTabValue={setNavTabValue}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Routes>
                <Route
                  index
                  key="workshop-trip-main"
                  element={
                    <TripMain trip={trip} token={token} queryKey={queryKey} />
                  }
                />
                <Route
                  key="workshop-trip-days"
                  path="/days"
                  element={
                    <TripDays
                      trip={trip}
                      queryKey={queryKey}
                      navTabValue={navTabValue}
                    />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Trip;
