import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService, type TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@components/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TripMain from "./TripMain";
import TripDays from "./TripDays";

const Trip = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { tripId } = useParams();
  const [tripDetail, setTripDetail] = useState<TripDetail | undefined>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [editName, setEditName] = useState<boolean>(false);
  const navigate = useNavigate();

  // rerender on access token and isUpdated
  useEffect(() => {
    const init = async () => {
      if (token && tripId) {
        const trip = await tripsService.getMyTripById(Number(tripId), token);
        setTripDetail(trip);
        setName(trip.name);
      }
    };
    init();
  }, [token, isUpdated]);

  const render = () => {
    setIsUpdated((prev) => !prev);
  };

  // name

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUpdateName = async () => {
    setEditName(false);

    if (token && isNewNameValid()) {
      const update = { name: name };
      await tripsService.patchTrip(Number(tripId), update, token);
      render();
    } else {
      setName(name.trim());
    }
  };

  const isNewNameValid = () => {
    let input = name.trim();
    return input.length > 0 && input.length <= 50 && input !== tripDetail?.name;
  };

  // nav tab
  const navTabs = [{
    name: "General",
    to: `/workshop/trip/${tripId}`,
  }, {
    name: "Days",
    to: `/workshop/trip/${tripId}/days`,
  }];

  return (
    <Container maxWidth={false}>
      <Box color="black" mt={4}>
        <Grid container columns={14} spacing={2}>
          {/* nav tab */}
          <Grid size={2}>
            <List>
              {navTabs.map((navTab, i) => (
                <ListItem key={`trip-edit-nav-tab-${i}`} disablePadding>
                <ListItemButton
                  disableRipple
                  onClick={() => navigate(navTab.to)}
                >
                  <ListItemText primary={navTab.name} />
                </ListItemButton>
              </ListItem>
              ))}
            </List>
          </Grid>

          {/* content */}
          <Grid size={12} columns={12}>
            {/* Name */}
            <Grid
              size={12}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Grid container>
                {!editName && (
                  <>
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      sx={{ borderBottom: "2px solid transparent" }}
                    >
                      {tripDetail?.name}
                    </Typography>
                    <IconButton onClick={() => setEditName(true)}>
                      <EditIcon />
                    </IconButton>
                  </>
                )}
                {editName && (
                  <>
                    <TextField
                      input={name}
                      onChange={handleChangeName}
                      onEnterDown={handleUpdateName}
                      fullWidth
                      autoFocus
                      inputSx={{
                        fontSize: "2.125rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        py: 0.2,
                        px: 0,
                        height: "auto",
                      }}
                    />
                    <IconButton
                      disableRipple
                      color="error"
                      onClick={() => setEditName(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <IconButton
                      disableRipple
                      color="success"
                      onClick={handleUpdateName}
                    >
                      <CheckIcon />
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Routes>
              <Route
                index
                key="workshop-trip-edit-main"
                element={
                  <TripMain
                    tripDetail={tripDetail}
                    token={token}
                    render={render}
                  />
                }
              />
              <Route
                key="workshop-trip-edit-days"
                path="/days"
                element={
                  <TripDays
                    tripDetail={tripDetail}
                    token={token}
                    render={render}
                  />
                }
              />
            </Routes>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Trip;
