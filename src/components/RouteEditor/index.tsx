import Map from "@components/Map";
import {
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
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import type { TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import { type Day, type TripAttractionOrder } from "@services/days";
import DraggableList from "@components/DraggableList";
import DraggableItem from "@components/DraggableItem";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AttractionFinder from "@components/AttractionFinder";

type RouteEditorProps = {
  tripDetail: TripDetail | undefined;
  open: boolean;
  setOpen: (dayId: number | undefined) => void;
};

const RouteEditor = ({ tripDetail, open, setOpen }: RouteEditorProps) => {
  const [editTao, setEditTao] = useState<number | undefined>(); // day order
  const [dayInEdit, setDayInEdit] = useState<Day | undefined>(); // day of the day order
  // edit tao
  const [taos, setTaos] = useState<TripAttractionOrder[] | undefined>();
  const [tao, setTao] = useState<TripAttractionOrder | undefined>(); // tao
  const [taoOrder, setTaoOrder] = useState<number>(Number.MAX_VALUE); // tao order
  const [showCustomRoutes, setShowCustomRoutes] = useState<boolean>(false);
  // get attraction
  const [openAttraction, setOpenAttraction] = useState<boolean>(false);

  // useEffect(() => {}, [tao]);

  // rerender the day in edit on editTao
  useEffect(() => {
    const getDayInEdit = () => {
      if (editTao) {
        const day = tripDetail?.days?.at(editTao - 1);
        setDayInEdit(day);
        if (tao && taos && day?.tripAttractionOrder) {
          setTaos(day?.tripAttractionOrder?.concat(taos));
          setShowCustomRoutes(tao.preferRoutes.length > 0);
        }
      } else setDayInEdit(undefined);
    };
    getDayInEdit();
  }, [editTao]);

  const handleToAddTao = (i: number) => {
    if (tripDetail) {
      let newTao = {
        dayId: 0,
        order: 0,
        attractionId: 0,
        estimateTime: 0,
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
      setEditTao(i + 1);
    }
  };

  /**
   * Check if the tao editing is the last on the taos list
   * Usage:
   * - decide to show route option or not
   * @returns true if is at the last index, false otherwise
   */
  const isLastTao = () => {
    if (taos && tao) {
      return taos?.findIndex((tao) => tao.id === tao.id) === taos?.length - 1;
    }
    return true;
  };

  // edit tao

  const updateAttraction = (attractionId: number) => {
    if (tao) {
      setTao({
      ...tao,
      attractionId: attractionId,
    });
    }
  }

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
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        <Grid size={4} height="100%">
          <List>
            {tripDetail?.days?.map((day, i) => (
              <Grid key={`route-editor-day-${day.id}`} size={12}>
                <ListItem>
                  <Typography fontWeight="bold" ml={2}>
                    Day {i + 1}
                  </Typography>
                  <Box ml="auto">
                    <IconButton onClick={() => handleToAddTao(i + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
                {day.tripAttractionOrder?.map((tao, i) => (
                  <ListItem key={`route-editor-tao-${tao.id}`}>
                    {tao.attractionId}: {tao.estimateTime} :{" "}
                    {tao.preferRoutes.toString()}
                  </ListItem>
                ))}
              </Grid>
            ))}
          </List>
        </Grid>
        <Grid size={8}>
          <Map height="100%" />
        </Grid>
      </Grid>

      {/* add new tao */}
      <Dialog
        open={Boolean(editTao)}
        onClose={() => setEditTao(undefined)}
        maxWidth={false}
      >
        <Grid container minWidth="60vw" height="80vh" direction="column">
          <Grid size={12}>
            <Box display="flex" justifyContent="center" alignItems="center" m={2}>
              <Typography variant="h5" fontWeight="bold">
                Day {editTao} {dayInEdit?.name}
              </Typography>
              <Box sx={{position: "absolute", right: 5}}>
                <IconButton
                  disableRipple
                  color="error"
                  // onClick={() => setEditDay(undefined)}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  disableRipple
                  color="success"
                  // onClick={() => handleUpdateDay(day.id)}
                >
                  <CheckIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider />
          </Grid>

          <Grid
            container
            size={12}
            direction="row"
            flexGrow={1}
            sx={{
              "--Grid-borderWidth": "1px",
              borderTop: "var(--Grid-borderWidth) solid",
              borderLeft: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
              "& > div": {
                borderRight: "var(--Grid-borderWidth) solid",
                borderBottom: "var(--Grid-borderWidth) solid",
                borderColor: "divider",
              },
            }}
          >
            {/* Left Panel */}
            <Grid size={4} p={2} sx={{
              height: "100%",
              overflowX: "hidden",
              overflowY: "auto",
              }}>
              <Box display="flex" justifyContent="center" mb={2}>
                <Typography fontWeight="bold">Attraction Order</Typography>
              </Box>
              <Divider />
                <DraggableList items={taos} setItems={setTaos}>
                {taos?.map((_tao, i) => (
                  <DraggableItem
                    key={`edit-day-tao-${i}`}
                    id={i}
                    enableDrag={_tao.id === tao?.id}
                  >
                    {_tao.attractionId}
                  </DraggableItem>
                ))}
              </DraggableList>
            </Grid>

            {/* Right Panel */}
            <Grid
              container
              size={8}
              direction="column"
              spacing={2}
              px={2}
              py={2}
            >
              {/* attraction */}
              <Grid container size={12} mb={1}>
                <Grid size={2}>
                  <Typography fontWeight="bold">Attraction*</Typography>
                </Grid>
                <Grid container size={10}>
                  <Box>
                    {Boolean(tao?.attractionId) ? (
                      <Typography>attraction info</Typography>
                    ) : (
                      <Typography>none</Typography>
                    )}
                  </Box>
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
              </Grid>

              {/* routes */}
              {!isLastTao() && (
                <Grid container size={12}>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={2}>
                    <Typography fontWeight="bold">Routes</Typography>
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
        
        <AttractionFinder open={openAttraction} setOpen={setOpenAttraction} updateAttr={updateAttraction}/>
      </Dialog>
    </Dialog>
  );
};

export default RouteEditor;
