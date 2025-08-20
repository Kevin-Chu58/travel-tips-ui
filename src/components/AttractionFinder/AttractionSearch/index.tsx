import TTIconButton from "@components/TTIconButton";
import { useIsMobile } from "@hooks/useIsMobile";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./index.scss";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import type { AttractionV2 } from "@services/attractions";
import { hereMapService } from "@services/hereMap/hereMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { GeoCoordinate } from "@constants/Types";
import ActionSpan from "@components/ActionSpan";
import ToolTip from "@components/ToolTip";
import { enqueueSnackbar } from "notistack";

type AttractionSearchProps = {
  search: string;
  setSearch: (state: string) => void;
  geoCoordinate: GeoCoordinate | undefined;
  setIsCoordMode: (state: boolean) => void;
  setResult: (state: AttractionV2[]) => void;
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
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleSearch = async () => {
    if (search.length > 0 && token && geoCoordinate) {
      try {
        setIsSearchLoading(true);

      const searchResult = await hereMapService.searchPlaceByName(
        search,
        geoCoordinate.lat,
        geoCoordinate.lng
      );

      await BehaviorUtils.sleep();
      setResult(searchResult);

      if (isMobile) setShowResult(true);
      }
      catch (e) {
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
                <ActionSpan>Click</ActionSpan> on the map to select the location where search begins.
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
        disabled={isSearchLoading || !Boolean(geoCoordinate)}
        size="small"
        placeholder="Find Attraction"
        className={textfieldClassName}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <TTIconButton
        disabled={isSearchLoading || !Boolean(geoCoordinate)}
        onClick={handleSearch}
        className="attraction-search-search-button"
      >
        {isSearchLoading ? (
          <CircularProgress size="1.4rem" sx={{ color: "white" }} />
        ) : (
          <SearchIcon />
        )}
      </TTIconButton>
    </React.Fragment>
  );
};

export default AttractionSearch;
