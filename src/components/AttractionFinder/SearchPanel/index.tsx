import { OsmTypes } from "@constants/Maps";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { osmService, type OsmEntity } from "@services/geoMap/osm";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import IdentifierUtils from "@utils/IdentifierUtils";

type SearchPanelProps = {
  result: OsmEntity[];
  setResult: (state: OsmEntity[]) => void;
  focusId: string | undefined;
  setIdFocus: (state: string) => void;
  setOpenHighlight: (state: boolean) => void;
  clearEditAttraction: () => void;
  handleClose: () => void;
};

const SearchPanel = ({
  result,
  setResult,
  focusId,
  setIdFocus,
  setOpenHighlight,
  clearEditAttraction,
  handleClose,
}: SearchPanelProps) => {
  // search and result
  const [search, setSearch] = useState<string>("");
  const [lastSearch, setLastSearch] = useState<string>("");

  const handleSearch = async () => {
    if (search.toLowerCase().trim() !== lastSearch.toLowerCase().trim()) {
      const searchResult = await osmService.getOsmEntitiesByName(search);
      setResult(filterResult(searchResult));
      setLastSearch(search);
      clearEditAttraction();
      setOpenHighlight(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filterResult = (result: OsmEntity[]) => {
    return result.filter((osm) => osm.osm_id !== undefined);
  };

  const handleFocusOsm = (osm: OsmEntity) => {
    clearEditAttraction();
    setIdFocus(IdentifierUtils.getOsmItemId(osm));
    setOpenHighlight(true);
  };

  const handleCloseWithSearch = () => {
    clearEditAttraction();
    setSearch("");
    setLastSearch("");
    handleClose();
  }

  return (
    <>
      <Grid size={12}>
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <Button
            variant="outlined"
            color="info"
            size="small"
            sx={{ position: "absolute", left: 10 }}
            onClick={handleCloseWithSearch}
            disableRipple
          >
            Close
          </Button>
          <Typography fontWeight="bold">Choose Attraction</Typography>
        </Box>
        <Divider />
      </Grid>

      {/* search */}
      <Grid size={12} position="relative" px={2}>
        <TextField
          size="small"
          placeholder="Search"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            ".MuiInputBase-root": {
              borderRadius: 10,
            },
            ".MuiInputBase-input": {
              width: "85%",
            },
          }}
        />
        <IconButton
          onClick={handleSearch}
          sx={{ position: "absolute", right: 15 }}
        >
          <SearchIcon />
        </IconButton>
      </Grid>
      {/* result list */}
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          flex: 1,
          p: 1,
          pt: 0,
        }}
      >
        <Divider />
        <Grid container display="flex" flexDirection="column" size={12}>
          {result.length === 0 && (
            <Grid size={12} mt={1} display="flex" justifyContent="center">
              <Typography>No match found.</Typography>
            </Grid>
          )}
          {result.map((osm, i) => (
            <Grid
              size={12}
              p={1}
              key={`attraction-finder-result-${i}`}
              color={
                IdentifierUtils.getOsmItemId(osm) === focusId
                  ? "primary.main"
                  : "black"
              }
              sx={{
                cursor: "pointer",
                ":hover": { bgcolor: "primary.100" },
              }}
              onClick={() => handleFocusOsm(osm)}
            >
              <Box display="flex" flexDirection="row" mt={1}>
                <Typography fontWeight="bold">
                  {osm.name.length > 0 ? osm.name : osm.class}
                </Typography>
                {osm.osm_type && (
                  <Chip
                    label={OsmTypes[osm.osm_type]}
                    size="small"
                    sx={{
                      ml: 1,
                    }}
                  />
                )}
              </Box>
              <Typography>{osm.display_name}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default SearchPanel;
