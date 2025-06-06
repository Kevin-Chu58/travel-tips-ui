import AttractionFinder from "@components/AttractionFinder";
import DraggableItem from "@components/DraggableItem";
import DraggableList from "@components/DraggableList";
import { HOURS, MINUTES } from "@constants/Times";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { Attraction } from "@services/attractions";
import type { TripAttractionOrder } from "@services/days";
import TimeUtils from "@utils/TimeUtils";
import { useState } from "react";

type AttracitonPanelProps = {
  taos: TripAttractionOrder[] | undefined;
  tao: TripAttractionOrder | undefined;
  time: number;
  setTaos: (state: TripAttractionOrder[] | undefined) => void;
  setTime: (state: number) => void;
  updateAttraction: (state: Attraction) => void;
};

const AttractionPanel = ({
  taos,
  tao,
  time,
  setTaos,
  setTime,
  updateAttraction,
}: AttracitonPanelProps) => {
  // open form status
  const [openAttraction, setOpenAttraction] = useState<boolean>(false);
  return (
    <Grid container size={12} direction="row" flexGrow={1} maxHeight="68.5vh">
      {/* Left Panel */}
      <Grid
        container
        direction="column"
        size={4}
        px={1}
        flexGrow={1}
        sx={{
          minHeight: 0,
          height: "68.5vh",
          borderRight: "1px solid",
          borderColor: "divider",
          "&.MuiGrid-root": {
            flexWrap: "nowrap",
            WebkitFlexWrap: "nowrap",
          },
        }}
      >
        <Grid size={12} px={2} pt={2}>
          <Typography color="primary.main" fontWeight="bold">
            Attraction Order
          </Typography>
          <Divider />
        </Grid>
        <Box
          maxHeight="100%"
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            flex: 1,
            pt: 0,
          }}
        >
          <Grid
            size={12}
            sx={{
              flex: 1,
              maxHeight: "100%",
              overflowX: "hidden",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DraggableList
              items={taos}
              setItems={setTaos}
              modifiers={[restrictToParentElement]}
            >
              {taos?.map((_tao, i) => {
                return (
                  <DraggableItem
                  key={`drag-item-${_tao.id}`}
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
                )
              })}
            </DraggableList>
          </Grid>
        </Box>
      </Grid>

      {/* Right Panel */}
      <Grid container size={8} direction="column" spacing={1} px={2} py={2}>
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
                    <Typography fontWeight="bold">Highlight</Typography>
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
              options={HOURS}
              getOptionLabel={(option) => String(option)}
              sx={{ width: 100 }}
              size="small"
              value={Math.floor(time / 60)}
              onChange={(_, val) => TimeUtils.updateTimeByHour(val ?? 0, time, setTime)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography ml={2}>Hours</Typography>
            <Autocomplete
              options={MINUTES}
              getOptionLabel={(option) => String(option)}
              sx={{ width: 100, ml: 2 }}
              size="small"
              value={time % 60}
              onChange={(_, val) => TimeUtils.updateTimeByMinute(val ?? 0, time, setTime)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography ml={2}>Minutes</Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* find attraction */}
      <AttractionFinder
        open={openAttraction}
        setOpen={setOpenAttraction}
        updateAttraction={updateAttraction}
      />
    </Grid>
  );
};

export default AttractionPanel;
