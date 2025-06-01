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
import ConditionalIconGroup from "@components/ButtonGroup/ConditionalSuccessButtonGroup";
import TTTabs from "@components/TTTabs";
import type { NavTab } from "@constants/Types";
import { HOURS, MINUTES } from "@constants/Times";
import AttractionPanel from "./AttractionPanel";
import RoutePanel from "./RoutePanel";

type TaoEditorProps = {
  day: Day | undefined;
  title: string;
  taoId?: number;
  taoOrder?: number;
  open: boolean;
  handleClose: () => void;
};

const TaoEditor = ({
  day,
  title,
  taoId,
  taoOrder,
  open,
  handleClose,
}: TaoEditorProps) => {
  // const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // const [editTao, setEditTao] = useState<number | undefined>(); // index of day in trip
  // const [day, setDay] = useState<Day | undefined>(); // day

  // nav tab
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // edit tao
  const [taos, setTaos] = useState<TripAttractionOrder[] | undefined>();
  const [tao, setTao] = useState<TripAttractionOrder | undefined>();
  // const [taoOrder, setTaoOrder] = useState<number>(Number.MAX_VALUE); // tao order
  const [time, setTime] = useState<number>(30);
  // const [travelTime, setTravelTime] = useState<number>(60);

  // get attraction

  // const [openAttraction, setOpenAttraction] = useState<boolean>(false);

  // rerender on isUpdated to update the trip
  // useEffect(() => {
  //   render();
  // }, [isUpdated]);

  // rerender on tao attraction id change
  // useEffect(() => {
  //   if (tao?.attraction?.id) {
  //     let taoIndex = taos?.findIndex((_tao) => _tao.id === tao.id);
  //     let newTaos = taos;
  //     newTaos![taoIndex!] = tao;
  //     setTaos(newTaos);
  //   }
  // }, [tao?.attraction?.id]);

  // rerender on time change to update estimate time on tao
  // useEffect(() => {
  //   setTao({ ...tao!, estimateTime: time });
  // }, [time]);

  // rerender on taoOrder change to update order on tao
  // useEffect(() => {
  //   setTao({ ...tao!, order: taoOrder });
  // }, [taoOrder]);

  // rerender the day in edit on editTao
  // useEffect(() => {
  //   const getDayInEdit = () => {
  //     if (!taoId) {
  //       const _day = trip?.days?.at(open!);
  //       setDay(_day);
  //       setTime(30);
  //       setTao({ ...tao!, dayId: _day!.id });
  //       // set the edit tao information
  //       if (tao && taos && _day?.tripAttractionOrders) {
  //         setTaos(_day?.tripAttractionOrders?.concat(taos));
  //         setTaoOrder(taos.length + 1);
  //         setShowCustomRoutes(tao.preferRoutes.length > 0);
  //       }
  //     } else {
  //       setDay(undefined);
  //     }
  //   };
  //   getDayInEdit();
  // }, [taoId]);

  // rerender taos and tao on opening this form
  useEffect(() => {
    if (open) {
      if (taoId) {
        // to edit a tao
        setTaos(day?.tripAttractionOrders);
        const tao = day?.tripAttractionOrders?.find((tao) => tao.id === taoId);
        setTao(tao);
      } else {
        // to add a new tao
        // TODO
      }
    }
  }, [open]);

  const handleToAddTao = (i: number) => {
    let newTao = {
      dayId: 0,
      order: 1,
      highlightId: 0,
      // estimateTime: time,
      // estimateTravelTime: travelTime,
      isDrivePreferred: true,
      isBikePreferred: true,
      isOnFootPreferred: true,
      id: 0,
      createdBy: 0,
      preferRoutes: [],
    };
    let newTaos = [newTao];
    // setTao(newTao);
    // setTaos(newTaos);
  };

  const handleAddTao = async () => {
    let newTao = {
      ...tao!,
      highlightId: tao!.attraction!.id,
    };

    // await daysService.postNewTao(newTao, token!);
    // setIsUpdated((prev) => !prev);
    handleClose();
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

  // const isConditionMet = () => {
  //   return tao?.attraction !== undefined && time > 0;
  // };

  const updateAttraction = (attraction: Attraction) => {
    setTao({
      ...tao!,
      attraction: attraction,
    });
  };

  /** nav bar */

  const navTabs = [
    {
      name: "Attraction",
      label: "Attraction",
    },
    {
      name: "Route",
      label: "Route",
      condition: !isLastTao(),
    },
  ] as NavTab[];

  const handleNavTabChange = (value: number) => {
    setNavTabValue(value);
  };

  return (
    <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="md" fullWidth>
      <Grid
        container
        minWidth="600px"
        height="80vh"
        direction="column"
        sx={{
          overflow: "hidden",
          "&.MuiGrid-root": {
            flexWrap: "nowrap",
            WebkitFlexWrap: "nowrap",
          },
        }}
      >
        {/* headers and tabs */}
        <Grid size={12} height="11.5vh" sx={{ flexShrink: 0 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            m={2}
            mb={-1}
          >
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
            <Box sx={{ position: "absolute", right: 5 }}>
              <ConditionalIconGroup
                onClose={handleClose}
                onConfirm={() => handleAddTao()}
                // isConditionMet={isConditionMet()}
              />
            </Box>
          </Box>
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              px: 2,
            }}
          >
            <TTTabs
              navTabValue={navTabValue}
              navTabs={navTabs}
              handleChange={handleNavTabChange}
            />
          </Box>
        </Grid>

        {navTabValue === 0 && (
          <Grid
            size={12}
            sx={{
              flex: 1,
              minHeight: 0,
              height: "68.5vh",
              overflowY: "auto",
            }}
          >
            <AttractionPanel
              taos={taos}
              tao={tao}
              time={time}
              setTaos={setTaos}
              setTime={setTime}
              updateAttraction={updateAttraction}
            />
          </Grid>
        )}

        {navTabValue === 1 && <RoutePanel tao={tao} setTao={setTao} />}
      </Grid>
    </Dialog>
  );
};

export default TaoEditor;
