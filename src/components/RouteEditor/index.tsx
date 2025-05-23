import Map from "@components/Map";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  TextField,
  Typography,
} from "@mui/material";
import type { TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import {
  daysService,
  type Day,
  type TripAttractionOrder,
} from "@services/days";
import DraggableList from "@components/DraggableList";
import DraggableItem from "@components/DraggableItem";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import AddIcon from "@mui/icons-material/Add";
import AttractionFinder from "@components/AttractionFinder";
import type { Attraction } from "@services/attractions";
import ConditionalIconGroup from "@components/ConditionalIconGroup";

type RouteEditorProps = {
  tripDetail: TripDetail | undefined;
  open: boolean;
  setOpen: (dayId: number | undefined) => void;
  token: string | null;
  render: () => void;
};

const RouteEditor = ({
  tripDetail,
  open,
  setOpen,
  token,
  render,
}: RouteEditorProps) => {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [editTao, setEditTao] = useState<number | undefined>(); // index of day in tripDetail
  const [dayInEdit, setDayInEdit] = useState<Day | undefined>(); // day
  // edit tao
  const [taos, setTaos] = useState<TripAttractionOrder[] | undefined>();
  const [tao, setTao] = useState<TripAttractionOrder | undefined>(); // tao
  const [taoOrder, setTaoOrder] = useState<number>(Number.MAX_VALUE); // tao order
  const [time, setTime] = useState<number>(30);
  const [travelTime, setTravelTime] = useState<number>(60);
  const [showCustomRoutes, setShowCustomRoutes] = useState<boolean>(false);
  // get attraction
  const [openAttraction, setOpenAttraction] = useState<boolean>(false);
  // time options
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // rerender on isUpdated to update the tripDetail
  useEffect(() => {
    render();
  }, [isUpdated]);

  // rerender on tao attraction id change
  useEffect(() => {
    if (tao?.attraction?.id) {
      let taoIndex = taos?.findIndex((_tao) => _tao.id === tao.id);
      let newTaos = taos;
      newTaos![taoIndex!] = tao;
      setTaos(newTaos);
    }
  }, [tao?.attraction?.id]);

  // rerender on time change to update estimate time on tao
  useEffect(() => {
    setTao({ ...tao!, estimateTime: time });
  }, [time]);

  // rerender on taoOrder change to update order on tao
  useEffect(() => {
    setTao({ ...tao!, order: taoOrder });
  }, [taoOrder]);

  // rerender the day in edit on editTao
  useEffect(() => {
    const getDayInEdit = () => {
      if (editTao) {
        const day = tripDetail?.days?.at(editTao - 1);
        setDayInEdit(day);
        setTime(30);
        setTao({ ...tao!, dayId: day!.id });
        // set the edit tao information
        if (tao && taos && day?.tripAttractionOrders) {
          setTaos(day?.tripAttractionOrders?.concat(taos));
          setTaoOrder(taos.length + 1);
          setShowCustomRoutes(tao.preferRoutes.length > 0);
        }
      } else {
        setDayInEdit(undefined);
      }
    };
    getDayInEdit();
  }, [editTao]);

  const handleToAddTao = (i: number) => {
    if (tripDetail) {
      let newTao = {
        dayId: 0,
        order: 1,
        highlightId: 0,
        estimateTime: time,
        estimateTravelTime: travelTime,
        isDrivePreferred: true,
        isBikePreferred: true,
        isOnFootPreferred: true,
        id: 0,
        createdBy: tripDetail?.createdBy,
        preferRoutes: [],
      };
      let newTaos = [newTao];
      setTao(newTao);
      setTaos(newTaos);
      setEditTao(i);
    }
  };

  const handleAddTao = async () => {
    let newTao = {
      ...tao!,
      highlightId: tao!.attraction!.id,
    };

    await daysService.postNewTao(newTao, token!);
    setIsUpdated((prev) => !prev);

    setEditTao(undefined);
  };

  /**
   * Check if the tao editing is the last on the taos list
   * Usage:
   * - decide to show route option or not
   * @returns true if is at the last index, false otherwise
   */
  const isLastTao = () => {
    if (taos && tao) {
      return taos?.findIndex((_tao) => _tao.id === tao.id) === taos?.length - 1;
    }
    return true;
  };

  // edit tao

  const isConditionMet = () => {
    return tao?.attraction !== undefined && time > 0;
  };

  const updateAttraction = (attraction: Attraction) => {
    setTao({
      ...tao!,
      attraction: attraction,
    });
  };

  const updateTimeByHour = (hours: number) => {
    let minutes = time % 60;
    setTime(hours * 60 + minutes);
  };

  const updateTimeByMinute = (minute: number) => {
    let hours = Math.floor(time / 60);
    setTime(hours * 60 + minute);
  };

  const toggleIsDrive = () => {
    if (tao) {
      setTao({
        ...tao,
        isDrivePreferred: !tao.isDrivePreferred,
      });
    }
  };

  const toggleIsBike = () => {
    if (tao) {
      setTao({
        ...tao,
        isBikePreferred: !tao.isBikePreferred,
      });
    }
  };

  const toggleIsOnFoot = () => {
    if (tao) {
      setTao({
        ...tao,
        isOnFootPreferred: !tao.isOnFootPreferred,
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(undefined)} maxWidth={false}>
      <Grid
        container
        minWidth="60vw"
        height="80vh"
      >
        {/* left panel */}
        <Grid size={4} height="100%">
          <List>
            {tripDetail?.days?.map((day, i) => (
              <Grid key={`route-editor-day-${day.id}`} size={12}>
                <Grid
                  container
                  size={12}
                  alignItems="center"
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography fontWeight="bold" ml={2}>
                    Day {i + 1}
                  </Typography>
                  <Box ml="auto">
                    <IconButton onClick={() => handleToAddTao(i + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                {day.tripAttractionOrders?.map((tao) => (
                  <Grid
                    container
                    size={12}
                    key={`route-editor-tao-${tao.id}`}
                    p={2}
                    alignItems="center"
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {tao.attraction?.name} - {tao.estimateTime} Minutes
                  </Grid>
                ))}
              </Grid>
            ))}
          </List>
        </Grid>
        {/* right panel */}
        <Grid size={8} sx={{ borderLeft: "1px solid", borderColor: "divider" }}>
          <Map height="100%" />
        </Grid>
      </Grid>

      {/* add/edit tao */}
      <Dialog
        open={Boolean(editTao)}
        onClose={() => setEditTao(undefined)}
        maxWidth="md"
        fullWidth
      >
        <Grid container minWidth="600px" height="80vh" direction="column">
          <Grid size={12}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              m={2}
            >
              <Typography variant="h5" fontWeight="bold">
                Day {editTao} {dayInEdit?.name}
              </Typography>
              <Box sx={{ position: "absolute", right: 5 }}>
                <ConditionalIconGroup
                  onClose={() => setEditTao(undefined)}
                  onConfirm={() => handleAddTao()}
                  isConditionMet={isConditionMet()}
                />
              </Box>
            </Box>
            <Divider variant="fullWidth" />
          </Grid>

          <Grid container size={12} direction="row" flexGrow={1}>
            {/* Left Panel */}
            <Grid
              size={4}
              p={2}
              sx={{
                height: "100%",
                overflowX: "hidden",
                overflowY: "auto",
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid
                container
                flexDirection="column"
                size={12}
                display="flex"
                mb={2}
              >
                <Typography color="primary.main" fontWeight="bold">
                  Attraction Order
                </Typography>
                <Divider />
              </Grid>
              <Grid
                size={12}
                flexGrow={1}
                sx={{
                  position: "relative",
                  overflowX: "hidden",
                  overflowY: "hidden",
                }}
              >
                <DraggableList
                  items={taos}
                  setItems={setTaos}
                  modifiers={[restrictToParentElement]}
                >
                  {taos?.map((_tao, i) => (
                    <DraggableItem
                      key={_tao.id}
                      id={_tao.id}
                      enableDrag={_tao.id === tao?.id}
                      sx={{ overflow: "hidden" }}
                    >
                      <Grid
                        size={2}
                        bgcolor={_tao.id === tao?.id ? "primary.main" : "grey"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="h6" color="white" p={1}>
                          {i + 1}
                        </Typography>
                      </Grid>
                      <Grid size={10} display="flex" alignItems="center">
                        <Typography ml={1}>
                          {_tao.attraction?.name ?? "New*"}
                        </Typography>
                      </Grid>
                    </DraggableItem>
                  ))}
                </DraggableList>
              </Grid>
            </Grid>

            {/* Right Panel */}
            <Grid
              container
              size={8}
              direction="column"
              spacing={1}
              px={2}
              py={2}
            >
              {/* attraction */}
              <Grid size={12} mb={1}>
                <Grid container size={12}>
                  <Typography fontWeight="bold" color="primary.main">
                    Attraction*
                  </Typography>
                  <Button
                    disableRipple
                    variant="contained"
                    size="small"
                    sx={{ ml: "auto" }}
                    onClick={() => setOpenAttraction(true)}
                  >
                    choose
                  </Button>
                </Grid>
                <Grid size={12}>
                  {tao?.attraction ? (
                    <>
                      <Typography fontWeight="bold">
                        {tao?.attraction.name}
                      </Typography>
                      <Typography>{tao?.attraction.address}</Typography>
                      {tao?.attraction.description && (
                        <Grid size={12} mt={1}>
                          <Typography fontWeight="bold">
                            The Highlight
                          </Typography>
                          <Typography ml={1}>
                            {tao?.attraction.description}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  ) : (
                    <Typography>none</Typography>
                  )}
                </Grid>
              </Grid>

              {/* estimated time */}
              <Grid size={12}>
                <Grid size={12}>
                  <Typography fontWeight="bold" color="primary.main">
                    Estimated Time*
                  </Typography>
                </Grid>
                <Grid container size={12} alignItems="center">
                  <Autocomplete
                    options={hours}
                    getOptionLabel={(option) => String(option)}
                    sx={{ width: 100 }}
                    size="small"
                    value={Math.floor(time / 60)}
                    onChange={(_, val) => updateTimeByHour(val ?? 0)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography ml={2}>Hours</Typography>
                  <Autocomplete
                    options={minutes}
                    getOptionLabel={(option) => String(option)}
                    sx={{ width: 100, ml: 2 }}
                    size="small"
                    value={time % 60}
                    onChange={(_, val) => updateTimeByMinute(val ?? 0)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography ml={2}>Minutes</Typography>
                </Grid>
              </Grid>

              {/* routes */}
              {!isLastTao() && (
                <Grid container size={12}>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={2}>
                    <Typography fontWeight="bold" color="primary.main">
                      Routes
                    </Typography>
                  </Grid>
                  <Grid size={10}>
                    <Grid container size={12}>
                      <Grid size={6}>
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={tao?.isDrivePreferred}
                          onChange={toggleIsDrive}
                          label="Drive"
                        />
                      </Grid>
                      <Grid size={6}>
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={tao?.isBikePreferred}
                          onChange={toggleIsBike}
                          label="Bike"
                        />
                      </Grid>
                      <Grid size={6}>
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={tao?.isOnFootPreferred}
                          onChange={toggleIsOnFoot}
                          label="On Foot"
                        />
                      </Grid>
                      <Grid size={12}>
                        <Divider textAlign="left">
                          {!showCustomRoutes ? (
                            <Chip
                              onClick={() => setShowCustomRoutes(true)}
                              icon={<AddIcon />}
                              label={<Typography>Add custom route</Typography>}
                              sx={{
                                cursor: "pointer",
                                ":hover": {
                                  color: "white",
                                  bgcolor: "primary.main",
                                  ".MuiChip-icon": {
                                    color: "white",
                                  },
                                },
                              }}
                            />
                          ) : (
                            <Chip
                              onDelete={() => setShowCustomRoutes(false)}
                              label={<Typography>Custom route</Typography>}
                              sx={{
                                cursor: "pointer",
                                ":hover": {
                                  color: "white",
                                  bgcolor: "primary.main",
                                  ".MuiChip-icon": {
                                    color: "white",
                                  },
                                },
                              }}
                            />
                          )}
                        </Divider>
                      </Grid>

                      {/* custom routes */}
                      {showCustomRoutes && (
                        <Grid size={12} mt={0.2}>
                          {/* departure & arrival */}
                          <Grid container size={12}>
                            <Grid size={6}>
                              <Typography fontWeight="bold">
                                Departure (osmId)
                              </Typography>
                              <Typography>tao.attraction.name</Typography>
                              <Typography fontStyle="italic">
                                tao.attraction.address
                              </Typography>
                            </Grid>
                            <Grid size={6}>
                              <Typography fontWeight="bold">
                                Arrival (osmId)
                              </Typography>
                              <Typography>nextTao.attraction.name</Typography>
                              <Typography fontStyle="italic">
                                nextTao.attraction.address
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid container fontSize={12}>
                            <TextField size="small" label="Search for routes" />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        <AttractionFinder
          open={openAttraction}
          setOpen={setOpenAttraction}
          updateAttraction={updateAttraction}
        />
      </Dialog>
    </Dialog>
  );
};

export default RouteEditor;
