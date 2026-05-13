import { useEffect, useState } from "react";
import FormBase from "../FormBases/FormBase";
import {
  regionsService,
  type Region,
  type RegionComplete,
} from "@services/search/regions";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import type { TripSearchParams } from "@services/trips";
import { LS_ALL_COUNTRIES } from "@constants/localStorage";

type RegionFormProps = {
  open: boolean;
  onClose?: () => void;
  onUpdate?: (state?: number) => void;
  onContentUpdate?: (state: Partial<TripSearchParams>) => void;
  completeRegion?: RegionComplete;
  setCompleteRegion?: React.Dispatch<React.SetStateAction<RegionComplete>>;
  countrySlug?: string;
  stateSlug?: string;
  content?: boolean;
};

const RegionForm = ({
  open,
  onClose = () => {},
  onUpdate = () => {},
  onContentUpdate = () => {},
  completeRegion,
  setCompleteRegion,
  countrySlug,
  stateSlug,
  content,
}: RegionFormProps) => {
  // region data
  const [countries, setCountries] = useState<Region[]>([]);
  const [states, setStates] = useState<Region[]>([]);
  // region slug
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  // actual region
  const _country = countries.find((c) => c.slug === country);
  const _state = states.find((s) => s.slug === state);
  const _regionId = _state?.id ?? _country?.id;
  const regionId = completeRegion?.state?.id ?? completeRegion?.country?.id;

  const initSelectRegions = () => {
    let _country = content ? countrySlug : completeRegion?.country?.slug;
    let _state = content ? stateSlug : completeRegion?.state?.slug;
    setCountry(_country ?? "");
    setState(_state ?? "");
  };

  // rerender region selects on complete region
  useEffect(() => {
    if (completeRegion || countrySlug || stateSlug) initSelectRegions();
  }, [completeRegion, countrySlug, stateSlug]);

  // render countries on initalization
  useEffect(() => {
    const initCountries = async () => {
      let allCountriesStr = localStorage.getItem(LS_ALL_COUNTRIES);
      let allCountries = undefined;

      if (allCountriesStr) {
        allCountries = JSON.parse(allCountriesStr) as Region[];
        setCountries(allCountries);
        return;
      }

      allCountries = (await regionsService.browse({
        type: "Country",
      })) as Region[];

      setCountries(allCountries);
      localStorage.setItem(LS_ALL_COUNTRIES, JSON.stringify(allCountries));
    };

    if (open) initCountries();
  }, [open]);

  // rerender states on country
  useEffect(() => {
    const initStates = async () => {
      if (_country) {
        const states = (await regionsService.browse({
          type: "State",
          parentRegionId: _country.id,
        })) as Region[];
        setStates(states);
      } else setStates([]);
    };
    initStates();
  }, [_country?.id]);

  // form handle

  const handleClose = () => {
    onClose();
  };

  // region handle

  const handleCountryChange = (event: SelectChangeEvent) => {
    setCountry(event.target.value);
    setState("");

    if (content)
      onContentUpdate({
        countrySlug: event.target.value,
        stateSlug: undefined,
      });

    if (setCompleteRegion) {
      const _country = countries.find((c) => c.slug === event.target.value);

      setCompleteRegion({
        country: _country,
        state: undefined,
      });
    }
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    setState(event.target.value);

    if (content) onContentUpdate({ stateSlug: event.target.value });

    if (setCompleteRegion) {
      const _country = countries.find((c) => c.slug === country);
      const _state = states.find((s) => s.slug === event.target.value);
      setCompleteRegion({
        country: _country,
        state: _state,
      });
    }
  };

  // components

  const regionFormSelects = (
    <Grid container columns={{ xs: 6, sm: 12 }} spacing={2}>
      <Grid size={6}>
        {/* country */}
        <FormControl className="select-form-control" fullWidth>
          <InputLabel id="select-country-label" color="region">
            Country
          </InputLabel>
          <Select
            id="select-country-input"
            value={country}
            label="Country"
            color="region"
            onChange={handleCountryChange}
          >
            <MenuItem className="region-menu-item" value="">
              <em>None</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem
                key={country.id}
                className="region-menu-item"
                value={country.slug}
              >
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        {/* state */}
        <FormControl className="select-form-control" fullWidth>
          <InputLabel id="select-state-label" color="region">
            State
          </InputLabel>
          <Select
            id="select-state-input"
            value={state}
            label="State"
            color="region"
            onChange={handleStateChange}
          >
            <MenuItem className="region" value="">
              <em>None</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state.id} className="region" value={state.slug}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  if (content) {
    return regionFormSelects;
  }

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      title="Choose Region"
      actionButtonLabel="Update"
      actionButtonStartIcon={<CheckIcon />}
      actionButtonOnClick={() => onUpdate(_regionId)}
      disableActionButton={regionId === _regionId}
    >
      {regionFormSelects}
    </FormBase>
  );
};

export default RegionForm;
