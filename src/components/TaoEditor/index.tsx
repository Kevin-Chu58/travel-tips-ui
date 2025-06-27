import { Box, Dialog, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { type Day, type TripAttractionOrder } from "@services/days";
import type { Attraction } from "@services/attractions";
import ConditionalSuccessIconGroup from "@components/ButtonGroup/ConditionalSuccessButtonGroup";
import TTTabs from "@components/TTTabs";
import type { NavTab } from "@constants/Types";
import AttractionPanel from "./AttractionPanel";
import RoutePanel from "./RoutePanel";
import { useTaoMutations } from "@react-queries/useTaoQueriers";
import TripUtils from "@utils/TripUtils";
import { useTripTimeline } from "@components/TripTimelineMap/TripTimeline/TripTimelineProvider";

type TaoEditorProps = {
  day: Day | undefined;
  title: string;
  render: () => void;
};

const TaoEditor = ({
  day,
  title,
  render,
}: TaoEditorProps) => {
  // constants
  const defaultTime = 30;
  const defaultTravelTime = 60;
  // nav tab
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // edit tao
  const [taos, setTaos] = useState<TripAttractionOrder[] | undefined>();
  const [tao, setTao] = useState<TripAttractionOrder | undefined>();
  // const [taoOrder, setTaoOrder] = useState<number>(Number.MAX_VALUE); // tao order
  const [time, setTime] = useState<number>(defaultTime);
  const [travelTime, setTravelTime] = useState<number>(defaultTravelTime);

  const {
    // props
    trip,
    token,
    queryKey,
    // tao
    editTao,
    editTaoOrder,
    openEditTao,
    setOpenEditTao,
  } = useTripTimeline();
  
  const taoId = editTao;
  const taoOrder= editTaoOrder;
  const open = openEditTao;
  const handleClose = () => setOpenEditTao(false);

  const { mutationAddTao, mutationUpdateTao } = useTaoMutations({
    trip,
    token,
    editDay: day?.id,
    queryKey,
  });

  // rerender taos and tao on opening this form
  useEffect(() => {
    if (open) {
      if (taoId) {
        // to edit a tao
        setTaos(day?.tripAttractionOrders);
        const tao = day?.tripAttractionOrders?.find((tao) => tao.id === taoId);
        setTao(tao);
        setTime(tao!.estimateTime);
        setTravelTime(tao!.estimateTravelTime);
      } else {
        // to add a new tao
        let newTao = {
          dayId: day?.id,
          order: taoOrder ?? 1,
          highlightId: 0,
          estimateTime: time,
          estimateTravelTime: travelTime,
          isDrivePreferred: true,
          isBikePreferred: true,
          isOnFootPreferred: true,
          id: 0,
          createdBy: trip?.createdBy,
          preferRoutes: [],
        } as TripAttractionOrder;

        let _taos = [...(day?.tripAttractionOrders ?? [])];
        _taos.splice(newTao.order, 0, newTao);
        setTao(newTao);
        setTaos(_taos);
      }
      setNavTabValue(0);
    }
  }, [open]);

  const handleAddTao = async () => {
    if (isConditionMet()) {
      mutationAddTao.mutate(getTaoInfo());
      render();
      handleClearForm();
    }
  };

  const handleUpdateTao = async () => {
    if (isTaoUnchanged()) return;

    if (isConditionMet()) {
      mutationUpdateTao.mutate(getTaoInfo());
      render();
      handleClearForm();
    }
  };

  const handleClearForm = () => {
    setTime(defaultTime);
    setTravelTime(defaultTravelTime);
    handleClose();
  };

  const getTaoInfo = () => {
    return {
      id: taoId,
      order: TripUtils.getTaoIndex(taos, taoId ?? 0)! + 1,
      highlightId: tao!.attraction!.id,
      estimateTime: time,
      estimateTravelTime: travelTime,
      isDrivePreferred: tao!.isDrivePreferred,
      isBikePreferred: tao!.isBikePreferred,
      isOnFootPreferred: tao!.isOnFootPreferred,
    };
  };

  const isTaoUnchanged = () => {
    const _tao = TripUtils.getTaoFromDay(day, taoId);
    const _taoIndex = TripUtils.getTaoIndexFromDay(day, taoId);
    const taoIndex = TripUtils.getTaoIndex(taos, taoId);
    return (
      _taoIndex === taoIndex && // check the relative order of the tao
      _tao?.attraction?.id === tao?.attraction?.id && // check highlight id
      _tao?.estimateTime === time && // check time in attraction
      _tao?.estimateTravelTime === travelTime && // check time in travel
      _tao?.isDrivePreferred === tao?.isDrivePreferred &&
      _tao?.isBikePreferred === tao?.isBikePreferred &&
      _tao?.isOnFootPreferred === tao?.isOnFootPreferred
      // TODO - check prefer routes
    );
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

  const isAddConditionMet = () => {
    return tao?.attraction !== undefined && time > 0 && travelTime > 0;
  };

  const isUpdateConditionMet = () => {
    return isAddConditionMet() && !isTaoUnchanged();
  };

  const isConditionMet = () => {
    return taoId ? isUpdateConditionMet() : isAddConditionMet();
  };

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

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClearForm}
      maxWidth="md"
      fullWidth
    >
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
              <ConditionalSuccessIconGroup
                onClose={handleClearForm}
                onConfirm={() => (taoId ? handleUpdateTao() : handleAddTao())}
                isConditionMet={isConditionMet()}
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
              setNavTabValue={setNavTabValue}
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

        {navTabValue === 1 && (
          <RoutePanel
            tao={tao}
            time={travelTime}
            setTao={setTao}
            setTime={setTravelTime}
          />
        )}
      </Grid>
    </Dialog>
  );
};

export default TaoEditor;
