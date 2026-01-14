import TTIconButton from "@components/TTIconButton";
import { useIsMobile } from "@hooks/useIsMobile";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import type { Attraction } from "@services/attractions";
import { hereMapService } from "@services/hereMap/hereMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { GeoCoordinate } from "@constants/Types";
import ActionSpan from "@components/ActionSpan";
import ToolTip from "@components/ToolTip";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

type AttractionSearchProps = {
  search: string;
  setSearch: (state: string) => void;
  geoCoordinate: GeoCoordinate | undefined;
  setIsCoordMode: (state: boolean) => void;
  setResult: (state: Attraction[]) => void;
  setShowResult: (state: boolean) => void;
};

const AttractionSearch = ({
  search,
  setSearch,
  geoCoordinate,
  setIsCoordMode,
  setResult,
  setShowResult,
}: AttractionSearchProps) => {
  // window
  const isMobile = useIsMobile();
  // styling
  const textfieldClassName = isMobile
    ? "attraction-search-textfield-mobile"
    : "attraction-search-textfield";
  // search
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  // search suggestion
  const isSuggestionValid = search.split(" ").length <= 3;
  const [suggestion, setSuggestion] = useState<string[]>([]);
  const [enableSuggestion, setEnableSuggestion] = useState<boolean>(true);
  // suggestion UI
  const suggestionRef = useRef<HTMLDivElement | null>(null);
  const rect = suggestionRef.current?.getBoundingClientRect();

  useEffect(() => {
    const timer = setTimeout(async () => {
      // only asks for suggestion when search is not empty
      if (enableSuggestion && search.length > 0 && isSuggestionValid) {
        let searchSuggestion =
          (await hereMapService.getSuggestionByName(search)) ?? []; // search has not changed for .5 second
        setSuggestion(searchSuggestion);
      }
    }, 400);

    return () => clearTimeout(timer); // reset timer when search changes
  }, [search]);

  const handleSearch = async (input?: string) => {
    setEnableSuggestion(false);

    let searchInput = input ?? search;

    if (searchInput.length > 0 && geoCoordinate) {
      try {
        setIsSearchLoading(true);

        const searchResult = await hereMapService.searchPlaceByName(
          searchInput,
          geoCoordinate.lat,
          geoCoordinate.lng
        );

        await BehaviorUtils.sleep();
        setResult(searchResult);

        if (isMobile) setShowResult(true);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }

      setIsSearchLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestInput: string) => {
    setSearch(suggestInput);
    setEnableSuggestion(false);
    handleSearch(suggestInput);
  };

  return (
    <React.Fragment>
      {/* search */}
      <TTIconButton
        disabled={isSearchLoading}
        onClick={() => setIsCoordMode(true)}
        className="attraction-search-coordinate-button"
      >
        <ToolTip
          title={
            <Box className="attraction-search-coordinate-tooltip-box">
              <Typography className="attraction-search-coordinate-tooltip-text">
                <ActionSpan>Click</ActionSpan> on the map to select the location
                where search begins.
              </Typography>
              {geoCoordinate && (
                <React.Fragment>
                  <Divider
                    className="attraction-search-coordinate-tooltip-divider"
                    flexItem
                  />
                  <Typography className="attraction-search-coordinate-tooltip-text">
                    Current Location: {"{"}
                    {Number(geoCoordinate?.lat.toFixed(7))},{" "}
                    {Number(geoCoordinate?.lng.toFixed(7))}
                    {"}"}
                  </Typography>
                </React.Fragment>
              )}
            </Box>
          }
        >
          <LocationOnIcon />
        </ToolTip>
      </TTIconButton>
      <TextField
        ref={suggestionRef}
        disabled={isSearchLoading || !Boolean(geoCoordinate)}
        size="small"
        placeholder="Find Attraction"
        className={textfieldClassName}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        onClick={() => setEnableSuggestion(true)}
      />
      <TTIconButton
        disabled={isSearchLoading || !Boolean(geoCoordinate)}
        onClick={() => handleSearch()}
        className="attraction-search-search-button"
        loading={isSearchLoading}
      >
        <SearchIcon />
      </TTIconButton>

      {enableSuggestion && suggestion.length > 0 && rect ? (
        <Box
          className="attraction-search-suggestion-container"
          top={rect.top}
          left={rect.left - rect.width}
        >
          <List disablePadding className="attraction-search-suggestion-list">
            {suggestion.map((suggestInput) => (
              <ListItemButton
                key={suggestInput}
                onClick={() => handleSuggestionClick(suggestInput)}
              >
                <Typography>{suggestInput}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      ) : undefined}
    </React.Fragment>
  );
};

export default AttractionSearch;
