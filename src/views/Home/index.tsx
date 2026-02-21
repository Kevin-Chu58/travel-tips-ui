import { Box, Chip, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  type TripSearchParams,
  tripsService,
  type Trip,
} from "@services/trips";
import { useNavigate, useSearchParams } from "react-router";
import TripCard from "@components/Cards/TripCard";
import TTIconButton from "@components/TTIconButton";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import TTButton from "@components/TTButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import type { SearchResults } from "@services/http";
import { useIsMobile } from "@hooks/useIsMobile";
import TripSearchForm from "@components/Forms/TripSearchForm";
import { enqueueSnackbar } from "notistack";
import { StringUtils } from "@utils/StringUtils";
import { type RegionComplete } from "@services/search/regions";
import { RegionUtils } from "@utils/RegionUtils";
import { usersService } from "@services/users";
import { useCursorScroll } from "@hooks/useCursorScroll";
import NavTopFab from "@components/Behavioral/NavTopFab";
import UserAvatar from "@components/UserAvatar";
import clsx from "clsx";
import "./index.scss";

const Home = () => {
  // window
  const isMobile = useIsMobile();
  // trips - search result
  const [trips, setTrips] = useState<Trip[]>([]);
  // search params
  const [tripParams, setTripParams] = useState<TripSearchParams>({}); // the only-true params
  const [tripFilterParams, setTripFilterParams] = useState<TripSearchParams>(
    {},
  ); // the temperal params for trip advanced search
  // param details
  const { title, budget, countrySlug, stateSlug, createdBy, tripOrderByEnum } =
    tripParams;
  const [completeRegion, setCompleteRegion] = useState<RegionComplete>({});
  // url
  const [searchParams, setSearchParams] = useSearchParams();
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);
  // behavior
  const isLoadingRef = useRef<boolean>(false);
  const isInit = useRef<boolean>(true);
  // form open status
  const [openTripSearchForm, setOpenTripSearchForm] = useState<boolean>(false);
  // others
  const navigate = useNavigate();
  const hasParamBase =
    Boolean(budget) || Boolean(countrySlug) || Boolean(createdBy);
  const hasParamSearch = hasParamBase || Boolean(tripFilterParams.title);
  const hasParamResult = hasParamBase || Boolean(title);

  // init searchTripParams and other states on searchParams
  useEffect(() => {
    if (searchParams.size === 0 || !isInit.current) return;

    const updateTripParms = async () => {
      const _budget = searchParams.get("budget") ?? undefined;

      // get createdBy user
      const createdByParam = searchParams.get("createdBy");
      const createdBy =
        createdByParam !== null
          ? await usersService.getUserByUserId(createdByParam)
          : undefined;

      const newParams = {
        title: searchParams.get("title") ?? "",
        countrySlug: searchParams.get("countrySlug") ?? undefined,
        stateSlug: searchParams.get("stateSlug") ?? undefined,
        budget: _budget ? parseInt(_budget) : undefined,
        createdBy: createdBy,
        tripOrderByEnum: searchParams.get("orderBy") ?? undefined,
        cursor: undefined,
      } as TripSearchParams;

      setTripParams(newParams);
    };

    updateTripParms();
  }, [searchParams]);

  // render trips on trip params, does not render on cursor change
  useEffect(() => {
    setTripFilterParams(tripParams);
    updateSearchParams();

    isInit.current = false;

    const initTrips = async () => {
      if (!hasParamResult) {
        setTrips([]);
        return;
      }

      await getTripsByParams(true);
    };
    initTrips();
  }, [title, budget, countrySlug, stateSlug, createdBy?.id, tripOrderByEnum]);

  // search params on url

  const updateSearchParams = () => {
    if (isInit.current) return;
    const params = new URLSearchParams();

    if (title) params.append("title", title);
    if (countrySlug) params.append("countrySlug", countrySlug);
    if (stateSlug) params.append("stateSlug", stateSlug);
    if (budget) params.append("budget", budget.toString());
    if (createdBy) params.append("createdBy", createdBy.userId);
    if (tripOrderByEnum) params.append("orderBy", tripOrderByEnum);

    setSearchParams(params.toString());
  };

  // trip params / trip filter params

  const updateTripFilterParams = (updates: Partial<TripSearchParams>) => {
    setTripFilterParams((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // async functions

  const asyncTripParams = () => {
    setTripParams({ ...tripFilterParams, cursor: undefined });
  };

  const asyncTripFilterParams = () => {
    setTripFilterParams((prev) => ({
      ...tripParams,
      title: prev.title,
      cursor: undefined,
    }));
  };

  const asyncTrips = (
    tripResults: SearchResults<Trip>,
    isNewSearch: boolean = false,
  ) => {
    if (!tripParams.cursor || isNewSearch) setTrips([...tripResults.results]);
    else setTrips((prev) => [...prev, ...tripResults.results]);
  };

  const asyncUpdateTrip = (trip: Trip) => {
    let _trips = [...trips];
    let tripIndex = _trips.findIndex((t) => t.id === trip.id);
    _trips[tripIndex] = trip;

    setTrips([..._trips]);
  };

  const getTripsByParams = async (isNewSearch: boolean = false) => {
    try {
      const tripResult = await tripsService.getTripsByParams(tripParams);
      asyncTrips(tripResult, isNewSearch);

      setTripParams((prev) => ({ ...prev, cursor: tripResult.cursor }));
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  /// handle events

  const handleScroll = useCursorScroll(
    containerRef,
    isLoadingRef,
    tripParams.cursor,
    getTripsByParams,
  );

  // trigger when click on the search icon button
  const handleSearch = async () => {
    asyncTripParams();
  };

  // trigger when press enter when focus on search input
  const handleKeyDownSearch = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  // trigger when press Close on Search Form
  const handleCloseAdvancedSearch = async () => {
    asyncTripFilterParams();
    setOpenTripSearchForm(false);
  };

  // trigger when press Apply on Search Form
  const handleApplyAdvancedSearch = async () => {
    asyncTripParams();
    setOpenTripSearchForm(false);
  };

  // trigger when deleting chips
  const handleDeleteChip = async (key: keyof TripSearchParams) => {
    const updatedFilter = {
      ...tripFilterParams,
      [key]: undefined,
      stateSlug: key !== "countrySlug" ? tripFilterParams.stateSlug : undefined,
      cursor: undefined,
    };
    setTripParams(updatedFilter);

    if (key === "countrySlug") setCompleteRegion({});
  };

  // components

  const chips = [
    {
      condition: title,
      param: "title",
      text: title,
      helpText: "Search",
    },
    {
      condition:
        Boolean(completeRegion.country) || Boolean(tripParams.countrySlug),
      param: "countrySlug",
      text: Boolean(completeRegion.country)
        ? RegionUtils.getRegionAddress(completeRegion)
        : RegionUtils.getRegionAddressBySlugs(
            tripParams.countrySlug,
            tripParams.stateSlug,
          ),
      helpText: "Region",
    },
    {
      condition: budget,
      param: "budget",
      text: StringUtils.getBudgetStr(budget),
      helpText: "budget",
    },
    {
      condition: createdBy,
      param: "createdBy",
      text: createdBy?.username,
      helpText: "Created By",
      avatar: createdBy,
    },
  ];

  const Recommendation = () => {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography>TODO - recommendation</Typography>
      </Box>
    );
  };

  const NoSearchResult = () => {
    return (
      <Box className="no-result-box">
        <Typography>No trips found.</Typography>
        <Typography>
          Try adjusting your filters or searching a different destination.
        </Typography>
      </Box>
    );
  };

  const SearchResult = () => {
    return (
      <React.Fragment>
        <Box>
          <Typography className="result-title" variant="h4">
            Matching Trips
          </Typography>
        </Box>
        <Box>
          {chips.map((chip) =>
            chip.condition ? (
              chip.avatar ? (
                <Chip
                  key={chip.param}
                  avatar={<UserAvatar user={chip.avatar} />}
                  label={chip.avatar.username}
                  onDelete={() =>
                    handleDeleteChip(chip.param as keyof TripSearchParams)
                  }
                  size="small"
                />
              ) : (
                <Chip
                  key={chip.param}
                  label={
                    <Typography variant="body2">
                      {chip.helpText ? `${chip.helpText}: ` : ""}
                      <strong>{chip.text}</strong>
                    </Typography>
                  }
                  onDelete={() =>
                    handleDeleteChip(chip.param as keyof TripSearchParams)
                  }
                  size="small"
                />
              )
            ) : undefined,
          )}
        </Box>
        {trips.length > 0 ? (
          <Box className="trip-cards-box">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => navigate(`/trip/${trip.id}`)}
                asyncUpdateTrip={asyncUpdateTrip}
                readonly
              />
            ))}
          </Box>
        ) : (
          <NoSearchResult />
        )}
      </React.Fragment>
    );
  };

  return (
    <Container
      className="home-page"
      ref={containerRef}
      onScroll={handleScroll}
      maxWidth={false}
      disableGutters
    >
      <Box className="search-box">
        <Box className="search-content-box">
          {/* input */}
          <TextField
            value={tripFilterParams.title ?? ""}
            onChange={(e) => updateTripFilterParams({ title: e.target.value })}
            onKeyDown={handleKeyDownSearch}
            className="search-input"
            placeholder="Where to go?"
            color="utility"
            size="small"
            autoFocus
            fullWidth
          />

          {/* search button */}
          <Box className="search-button-box">
            <TTIconButton onClick={handleSearch} disabled={!hasParamSearch}>
              <TravelExploreIcon />
            </TTIconButton>
          </Box>
        </Box>

        {/* filter button */}
        <Box className="search-filter-box">
          <TTButton
            startIcon={<FilterAltIcon />}
            label="Filter & Sort"
            color="utility"
            onClick={() => setOpenTripSearchForm(true)}
          />
        </Box>
      </Box>

      {/* content */}
      <Box className={clsx("content-box", isMobile && "mobile")}>
        {hasParamResult ? <SearchResult /> : <Recommendation />}
      </Box>

      {/* fabs */}
      <NavTopFab containerRef={containerRef} />

      {/* forms */}
      <TripSearchForm
        open={openTripSearchForm}
        onClose={handleCloseAdvancedSearch}
        onAction={handleApplyAdvancedSearch}
        tripFilterParams={tripFilterParams}
        updateTripFilterParams={updateTripFilterParams}
        setCompleteRegion={setCompleteRegion}
      />
    </Container>
  );
};

export default Home;
