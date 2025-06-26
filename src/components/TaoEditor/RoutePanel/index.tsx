import Map from "@components/Map";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { TripAttractionOrder } from "@services/days";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TTChipButton from "@components/TTChipButton";
import { HOURS, MINUTES } from "@constants/Times";
import TimeUtils from "@utils/TimeUtils";

type RoutePanelProps = {
  tao: TripAttractionOrder | undefined;
  time: number;
  setTime: (state: number) => void;
  setTao: (state: TripAttractionOrder | undefined) => void;
};

// TODO - custom prefer route and map indication

const RoutePanel = ({ tao, time, setTao, setTime }: RoutePanelProps) => {
  const [showCustomRoutes, setShowCustomRoutes] = useState<boolean>(false);

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
        <Grid size={12}>
          <Typography fontWeight="bold" color="primary.main">
            Routes
          </Typography>
        </Grid>
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
        </Grid>

        {/* expected time */}
        <Grid size={12}>
          <Grid size={12}>
            <Typography fontWeight="bold" color="primary.main">
              Expected Time*
            </Typography>
          </Grid>
          <Grid container direction="column" size={12} spacing={.5}>
            <Grid container size={12} alignItems="center">
              <Autocomplete
                options={HOURS}
                getOptionLabel={(option) => String(option)}
                sx={{ width: 100 }}
                size="small"
                value={Math.floor(time / 60)}
                onChange={(_, val) =>
                  TimeUtils.updateTimeByHour(val ?? 0, time, setTime)
                }
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography ml={2}>Hours</Typography>
            </Grid>
            <Grid container size={12} alignItems="center">
              <Autocomplete
                options={MINUTES}
                getOptionLabel={(option) => String(option)}
                sx={{ width: 100 }}
                size="small"
                value={time % 60}
                onChange={(_, val) =>
                  TimeUtils.updateTimeByMinute(val ?? 0, time, setTime)
                }
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography ml={2}>Minutes</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Grid size={12} mt={1}>
            <Divider textAlign="left">
              {!showCustomRoutes ? (
                <TTChipButton
                  onClick={() => setShowCustomRoutes(true)}
                  icon={<AddIcon />}
                  label={<Typography>Add custom route</Typography>}
                />
              ) : (
                <TTChipButton
                  onDelete={() => setShowCustomRoutes(false)}
                  label={<Typography>Custom route</Typography>}
                />
              )}
            </Divider>
          </Grid>
        </Grid>
      </Grid>

      {/* Right Panel */}
      <Grid container size={8} direction="column" spacing={1}>
        <Map height="100%" markers={[]} />
      </Grid>
    </Grid>
  );
};

export default RoutePanel;
