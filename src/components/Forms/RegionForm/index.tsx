import { useEffect, useState } from "react";
import FormBase from "../FormBase";
import {
  regionsService,
  type Region,
  type RegionComplete,
} from "@services/search/regions";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

type RegionFormProps = {
  open: boolean;
  onClose: () => void;
  onUpdate: (state?: number) => void;
  completeRegion?: RegionComplete;
};

const RegionForm = ({
  open,
  onClose,
  onUpdate,
  completeRegion,
}: RegionFormProps) => {
  // region data
  const [countries, setCountries] = useState<Region[]>([]);
  const [states, setStates] = useState<Region[]>([]);
  // region name
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  // actual region
  const _country = countries.find((c) => c.name === country);
  const _state = states.find((s) => s.name === state);
  const _regionId = _state?.id ?? _country?.id;
  const regionId = completeRegion?.state?.id ?? completeRegion?.country?.id;

  const initSelectRegions = () => {
    // for now only have country and state, no area yet
    setCountry(completeRegion?.country?.name ?? "");
    setState(completeRegion?.state?.name ?? "");
  };

  // rerender region selects on complete region
  useEffect(() => {
    initSelectRegions();
  }, [completeRegion]);

  // render countries on initalization
  useEffect(() => {
    const initCountries = async () => {
      const countries = (await regionsService.browse({
        type: "Country",
      })) as Region[];
      setCountries(countries);
    };
    initCountries();
  }, []);

  // rerender states on country
  useEffect(() => {
    const initStates = async () => {
      setState("");

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

  // rerender country and state selects on complete region
  useEffect(() => {
    if (!completeRegion) return;

    const initSelects = () => {
      setCountry(completeRegion?.country?.name ?? "");
      setState(completeRegion?.state?.name ?? "");
    };
    initSelects();
  }, [completeRegion, open]);

  // form handle

  const handleClose = () => {
    onClose();
  };

  // region handle

  const handleCountryChange = (event: SelectChangeEvent) => {
    setCountry(event.target.value);
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    setState(event.target.value);
  };

  // const handleUpdateClick = async () => {
  //   try {
  //     if (!tripId) return;

  //     const newCompleteRegion = (await tripsService.patchTripRegionTag(
  //       tripId,
  //       _regionId
  //     )) as RegionComplete;

  //     if (onUpdate) onUpdate(newCompleteRegion);

  //     handleClose();
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       enqueueSnackbar(e.message, { variant: "error" });
  //     }
  //   }
  // };

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
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* country */}
        <FormControl className="select-form-control">
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
            <MenuItem className="region" value="">
              <em>None</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem
                key={country.id}
                className="region"
                value={country.name}
              >
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* state */}
        <FormControl className="select-form-control">
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
              <MenuItem key={state.id} className="region" value={state.name}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </FormBase>
  );
};

export default RegionForm;
