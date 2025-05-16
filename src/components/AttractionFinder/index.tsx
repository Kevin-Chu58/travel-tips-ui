import Map from "@components/Map";
import {
  Box,
  Chip,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { osmService, type OsmEntity } from "@services/map/osm";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { OsmTypes } from "@constants/Osms";

type AttractionFinderProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  updateAttr: (id: number) => void;
};

const AttractionFinder = ({
  open,
  setOpen,
  updateAttr,
}: AttractionFinderProps) => {
  const [attraction, setAttraction] = useState<number | undefined>(); // selected attraction id
  const [attractionHover, setAttractionHover] = useState<number | undefined>(); // hovered osm id
  const [attractionFocus, setAttractionFocus] = useState<number | undefined>(); // focused osm id
  const [search, setSearch] = useState<string>("");
  const [lastSearch, setLastSearch] = useState<string>("");
  const [result, setResult] = useState<OsmEntity[]>([]);
  const [isMapUpdated, setIsMapUpdated] = useState<boolean>(false);

  // rerender on result
  useEffect(() => {}, [result]);

  const handleClose = () => {
    if (attraction) {
      updateAttr(attraction);
    }
    setOpen(false);
  };

  const handleSearch = async () => {
    if (search.toLowerCase().trim() !== lastSearch.toLowerCase().trim()) {
      const searchResult = await osmService.getOsmEntitiesByName(search);
      setResult(filterResult(searchResult));
      setIsMapUpdated((prev) => !prev);
      setLastSearch(search);
      // clear attraction hover and focus
      setAttractionFocus(undefined);
      setAttractionHover(undefined);
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}>
      <Grid
        container
        minWidth="60vw"
        height="80vh"
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        {/* left panel */}
        <Grid
          container
          direction="column"
          display="flex"
          flexDirection="column"
          size={4}
          spacing={2}
          height="100%"
          sx={{ overflowY: "auto" }}
        >
          <Grid size={12}>
            <Box display="flex" justifyContent="center" my={2}>
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
                  color={attractionFocus === osm.osm_id ? "primary.main" : "black"}
                  bgcolor={attractionHover === osm.osm_id ? "primary.100" : ""}
                  sx={{cursor: "pointer"}}
                  onMouseEnter={() => setAttractionHover(osm.osm_id)}
                  onMouseLeave={() => setAttractionHover(undefined)}
                  onClick={() => setAttractionFocus(osm.osm_id)}
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
        </Grid>

        {/* right panel */}
        <Grid size={8}>
          <Map
            height="100%"
            markers={result.map((r) => ({
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
              label: r.name,
              id: r.osm_id,
              zoom: r.place_rank,
            }))}
            isUpdated={isMapUpdated}
            focusId={attractionFocus}
            correctionBias={4}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AttractionFinder;
