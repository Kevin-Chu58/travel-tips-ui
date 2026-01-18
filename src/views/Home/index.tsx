import {
  Box,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  type tripSearchParams,
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
import clsx from "clsx";
import "./index.scss";

const Home = () => {
  // window
  const isMobile = useIsMobile();
  // trips - search result
  const [trips, setTrips] = useState<Trip[]>([]);
  // search params
  const [tripParams, setTripParams] = useState<tripSearchParams>({});
  const [input, setInput] = useState<string>("");
  // uri
  const [searchParams, setSearchParams] = useSearchParams();
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  // others
  const navigate = useNavigate();
  const hasParam =
    Boolean(tripParams.title) ||
    Boolean(tripParams.budget) ||
    Boolean(tripParams.countrySlug) ||
    Boolean(tripParams.createdBy);

  // init searchTripParams and other states on searchParams
  useEffect(() => {
    if (searchParams.size === 0 || !isInit) return;

    setTripParams({
      title: searchParams.get("title") ?? "",
      cursor: undefined,
    });

    setInput(searchParams.get("title") ?? "");

    setTrips([]);
  }, [searchParams]);

  useEffect(() => {
    if (!hasParam || !isInit) return;

    const initTrips = async () => {
      await getTrips();
      setIsInit(false);
    };
    initTrips();
  }, [tripParams]);

  const updateSearchParams = () => {
    const params = new URLSearchParams();

    if (input) params.append("title", input);

    setSearchParams(params.toString());
  };

  // async functions

  const asyncTrips = (tripResults: SearchResult<Trip>, newTitle?: string) => {
    if (!tripParams.cursor || newTitle) setTrips([...tripResults.results]);
    else setTrips((prev) => [...prev, ...tripResults.results]);

    setTripParams((prev) => ({
      ...prev,
      title: newTitle ?? prev.title,
      cursor: tripResults.cursor,
    }));
  };

  const getTrips = async () => {
    const tripResult = await tripsService.getTripsByParams(tripParams);
    asyncTrips(tripResult);
  };

  const getTripsByParams = async () => {
    const tripResult = await tripsService.getTripsByParams({
      ...tripParams,
      title: input,
      cursor: undefined,
    });
    asyncTrips(tripResult, input);
  };

  /// handle events

  const handleScroll = async () => {
    if (isLoading || !tripParams.cursor) return;

    setIsLoading(true);

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await getTrips();
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    await getTripsByParams();
    updateSearchParams();
  };

  const Recommendation = () => {
    return (
      <>
        <Grid size={12} display="flex" justifyContent="center">
          <Typography>No Result.</Typography>
        </Grid>
      </>
    );
  };

  const SearchResult = () => {
    return (
      <React.Fragment>
        <Grid size={12}>
          <Typography variant="h4" fontFamily="lily script one">
            Result
          </Typography>
        </Grid>
        <Grid size={12} mt={-2}>
          {tripParams.title ? (
            <Chip
              label={
                <Typography variant="body2">
                  search: <strong>{tripParams.title}</strong>
                </Typography>
              }
              size="small"
              onDelete={() => navigate("/home")} // nav doesn't work
            />
          ) : undefined}
        </Grid>
        <Grid
          size={12}
          display="flex"
          flexWrap="wrap"
          gap={2}
        >
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => navigate(`/trip/${trip.id}`)}
              readonly
            />
          ))}
        </Grid>
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
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input"
            placeholder="Where to go?"
            color="utility"
            size="small"
            autoFocus
            fullWidth
          />
          <Box className="search-button-box">
            <TTIconButton onClick={handleSearch}>
              <TravelExploreIcon />
            </TTIconButton>
          </Box>
        </Box>
        <Box className="search-filter-box">
          <TTButton
            startIcon={<FilterAltIcon />}
            label="filter"
            color="utility"
            onClick={() => {}}
          />
        </Box>
      </Box>

      {/* content */}
      <Box className={clsx("content-box", isMobile && "mobile")}>
        {trips.length > 0 ? <SearchResult /> : <Recommendation />}
      </Box>
    </Container>
  );
};

export default Home;
