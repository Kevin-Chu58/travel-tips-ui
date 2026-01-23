import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import FormBase from "../FormBase";
import BudgetForm from "../BudgetForm";
import type { TripSearchParams } from "@services/trips";
import type { RegionComplete } from "@services/search/regions";
import RegionForm from "../RegionForm";
import "./index.scss";

type TripSearchFormProps = {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
  tripFilterParams: TripSearchParams;
  updateTripFilterParams: (state: Partial<TripSearchParams>) => void;
  setCompleteRegion: React.Dispatch<React.SetStateAction<RegionComplete>>;
};

const TripSearchForm = ({
  open,
  onClose,
  onAction,
  tripFilterParams,
  updateTripFilterParams,
  setCompleteRegion,
}: TripSearchFormProps) => {
  return (
    <FormBase
      className="trip-filter-form"
      open={open}
      onClose={onClose}
      title="Advanced Search"
      width="50vw"
      actionButtonLabel="Apply"
      actionButtonOnClick={onAction}
      panel
    >
      <Grid container columns={{ xs: 6, sm: 12 }} spacing={2}>
        {/* region filter */}
        <Grid size={12}>
          <Typography className="form-title">Regions</Typography>
          <RegionForm
            open
            countrySlug={tripFilterParams.countrySlug}
            stateSlug={tripFilterParams.stateSlug}
            onContentUpdate={updateTripFilterParams}
            setCompleteRegion={setCompleteRegion}
            content
          />
        </Grid>
        {/* budget filter */}
        <Grid size={6}>
          <Typography className="form-title">Budget</Typography>
          <BudgetForm
            open
            budget={tripFilterParams.budget}
            onUpdate={(e) => updateTripFilterParams({ budget: e })}
            content
          />
        </Grid>
        {/* created by filter */}
        <Grid size={6}>
          <Typography className="form-title">Created By</Typography>
          <TextField
            value={tripFilterParams.createdByAuthId ?? ""}
            onChange={(e) =>
              updateTripFilterParams({ createdByAuthId: e.target.value })
            }
            placeholder="Enter User Auth0 Id"
            fullWidth
          />
        </Grid>

        <Grid size={12}>
          <Divider flexItem />
        </Grid>

        {/* Sort By */}
        <Grid size={12}>
          <Typography className="form-title">Sort By</Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Desc"
              value={tripFilterParams.isDesc === false ? "" : "Desc"}
              onChange={(e) =>
                updateTripFilterParams({ isDesc: Boolean(e.target.value) })
              }
            >
              <FormControlLabel
                value="Desc"
                control={<Radio />}
                label="Newest"
              />
              <FormControlLabel value="" control={<Radio />} label="Oldest" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default TripSearchForm;
