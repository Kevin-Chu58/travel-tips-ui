import {
  Box,
  Chip,
  Container,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
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
import type { SearchResult } from "@services/http";
import { useIsMobile } from "@hooks/useIsMobile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TripSearchForm from "@components/Forms/TripSearchForm";
import { enqueueSnackbar } from "notistack";
import { StringUtils } from "@utils/StringUtils";
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
    {}
  ); // the temperal params for trip advanced search
  // param details
  const { title, budget, countrySlug, stateSlug, createdByAuthId, isDesc } =
    tripParams;
  // url
  const [searchParams, setSearchParams] = useSearchParams();
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [showNavTop, setShowNavTop] = useState<boolean>(false);
  // form open status
  const [openTripSearchForm, setOpenTripSearchForm] = useState<boolean>(false);
  // others
  const navigate = useNavigate();
  const hasParamBase =
    Boolean(budget) || Boolean(countrySlug) || Boolean(createdByAuthId);
  const hasParamSearch = hasParamBase || Boolean(tripFilterParams.title);
  const hasParamResult = hasParamBase || Boolean(title);

  // init searchTripParams and other states on searchParams
  useEffect(() => {
    if (searchParams.size === 0 || !isInit) return;

    const _budget = searchParams.get("budget") ?? undefined;

    const newParams = {
      title: searchParams.get("title") ?? "",
      countrySlug: searchParams.get("countrySlug") ?? undefined,
      stateSlug: searchParams.get("stateSlug") ?? undefined,
      budget: _budget ? parseInt(_budget) : undefined,
      createdByAuthId: searchParams.get("createdBy") ?? undefined,
      isDesc: !(searchParams.get("isDesc") === "false"),
      cursor: undefined,
    } as TripSearchParams;

    setTripParams(newParams);
  }, [searchParams]);

  // render trips on trip params, does not render on cursor change
  useEffect(() => {
    setTripFilterParams(tripParams);
    updateSearchParams();

    const initTrips = async () => {
      if (!hasParamResult) {
        setTrips([]);
        return;
      }

      await getTripsByParams(true);
      setIsInit(false);
    };
    initTrips();
  }, [title, budget, countrySlug, stateSlug, createdByAuthId, isDesc]);

  // search params on url

  const updateSearchParams = () => {
    const params = new URLSearchParams();

    if (title) params.append("title", title);
    if (countrySlug) params.append("countrySlug", countrySlug);
    if (stateSlug) params.append("stateSlug", stateSlug);
    if (budget) params.append("budget", budget.toString());
    if (createdByAuthId) params.append("createdBy", createdByAuthId);
    if (isDesc === false) params.append("isDesc", "false");

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
    tripResults: SearchResult<Trip>,
    isNewSearch: boolean = false
  ) => {
    if (!tripParams.cursor || isNewSearch) setTrips([...tripResults.results]);
    else setTrips((prev) => [...prev, ...tripResults.results]);
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

  // trigger when scroll close to the bottom
  const handleScroll = async () => {
    // check whether condition met to show/hide button nav to top
    const isDown = (containerRef.current?.scrollTop ?? 0) >= 100;
    setShowNavTop((prev) => (prev !== isDown ? isDown : prev));

    if (isLoading || !tripParams.cursor) return;

    setIsLoading(true);

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await getTripsByParams();
    }

    setIsLoading(false);
  };

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

  // trigger when press Apply on Search Form
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
      cursor: undefined,
    };
    setTripParams(updatedFilter);
  };

  const handleNavTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      condition: countrySlug,
      param: "countrySlug",
      text: countrySlug,
      helpText: "Country",
    },
    {
      condition: stateSlug,
      param: "stateSlug",
      text: stateSlug,
      helpText: "State",
    },
    {
      condition: budget,
      param: "budget",
      text: StringUtils.getBudgetStr(budget),
      helpText: "budget",
    },
    {
      condition: createdByAuthId,
      param: "createdByAuthId",
      text: createdByAuthId,
      helpText: "Created By",
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
              <Chip
                key={chip.param}
                label={
                  <Typography variant="body2">
                    {chip.helpText ? `${chip.helpText}: ` : ""}
                    <strong>{chip.text}</strong>
                  </Typography>
                }
                size="small"
                onDelete={() =>
                  handleDeleteChip(chip.param as keyof TripSearchParams)
                }
              />
            ) : undefined
          )}
        </Box>
        {trips.length > 0 ? (
          <Box className="trip-cards-box">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => navigate(`/trip/${trip.id}`)}
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
      {showNavTop ? (
        <Fab className="nav-top-fab" color="utility" onClick={handleNavTop}>
          <ArrowUpwardIcon />
        </Fab>
      ) : undefined}

      {/* forms */}
      <TripSearchForm
        open={openTripSearchForm}
        onClose={handleCloseAdvancedSearch}
        onAction={handleApplyAdvancedSearch}
        tripFilterParams={tripFilterParams}
        updateTripFilterParams={updateTripFilterParams}
      />
    </Container>
  );
};

export default Home;
