import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import FormBase from "../FormBases/FormBase";
import RegionForm from "../RegionForm";
import BudgetForm from "../BudgetForm";
import type { TripSearchParams } from "@services/trips";
import type { RegionComplete } from "@services/search/regions";
import type { TripOrderByEnum, UtilityItem } from "@constants/Types";
import UserSearchAutoComplete from "@components/Search/UserSearchAutoComplete";
import type { UserSimple } from "@services/users";
import React from "react";
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
  const sortBys = [
    {
      label: "Newest",
      content: "newest",
    },
    {
      label: "Oldest",
      content: "oldest",
    },
    {
      label: "Most Bookmarked",
      content: "mostBookmarked",
    },
    {
      label: "Least Bookmarked",
      content: "leastBookmarked",
    },
  ] as UtilityItem[];

  const updateTripFilterParamsCreatedBy = (user?: UserSimple | undefined) => {
    updateTripFilterParams({ createdBy: user });
  };

  return (
    <FormBase
      className="trip-filter-form"
      open={open}
      onClose={onClose}
      title="Advanced Search"
      width="70vw"
      maxHeight="80vh"
      actionButtonLabel="Apply"
      actionButtonOnClick={onAction}
      panel
    >
      <Grid container columns={{ xs: 6, md: 12 }} spacing={2}>
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
          <UserSearchAutoComplete
            open={open}
            user={tripFilterParams.createdBy}
            setUser={updateTripFilterParamsCreatedBy}
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
              defaultValue="newest"
              value={tripFilterParams.tripOrderByEnum}
              onChange={(e) =>
                updateTripFilterParams({
                  tripOrderByEnum: e.target.value as TripOrderByEnum,
                })
              }
            >
              {sortBys.map((sortBy) => (
                <FormControlLabel
                  key={sortBy.content as string}
                  value={sortBy.content as string}
                  control={<Radio />}
                  label={sortBy.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default TripSearchForm;
