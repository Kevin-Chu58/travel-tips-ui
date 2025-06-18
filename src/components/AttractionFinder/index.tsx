import {
  Dialog,
  Grid,
} from "@mui/material";
import { type OsmEntity } from "@services/geoMap/osm";
import { useEffect, useState } from "react";
import { attractionsService, type Attraction } from "@services/attractions";
import SearchPanel from "./SearchPanel";
import MapPanel from "./MapPanel";
import IdentifierUtils from "@utils/IdentifierUtils";

type AttractionFinderProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  updateAttraction?: (attraction: Attraction) => void;
  setIsParentUpdated?: () => void;
};

const AttractionFinder = ({
  open,
  setOpen,
  updateAttraction,
  setIsParentUpdated,
}: AttractionFinderProps) => {

  // search and result
  const [result, setResult] = useState<OsmEntity[]>([]); // result from osm api
  // open form status
  const [openHighlight, setOpenHighlight] = useState<boolean>(false);
  const [openEditAttraction, setOpenEditAttraction] = useState<boolean>(false);
  // edit attraction
  const [description, setDescription] = useState<string>("");
  // choose osm and attraction
  const [idFocus, setIdFocus] = useState<string | undefined>(); // focused osm id
  const [attractionResult, setAttractionResult] = useState<Attraction[]>([]); // attractions available of the focused osm id
  const [attractionFocus, setAttractionFocus] = useState<
    Attraction | undefined
  >(); // focused attraction
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  // rerender on osmIdFocus for highlight results
  useEffect(() => {
    const initAttractionResult = async () => {
      if (idFocus) {
        const attraction = result.find((r) => IdentifierUtils.getOsmItemId(r) === idFocus);
        const highlightSearch = await attractionsService.getHighlightsByParams(
          undefined,
          attraction!.osm_id
        );
        setAttractionResult(highlightSearch.attractions);
      }
    };
    initAttractionResult();
  }, [idFocus, isUpdated]);

  // update parent attribute on attraction
  useEffect(() => {
    if (updateAttraction && attractionFocus) {
      updateAttraction(attractionFocus);
    }
  }, [attractionFocus]);

  const clear = () => {
    // clear attraction focus
    setIdFocus(undefined);
    setResult([]);
    setAttractionResult([]);
    setAttractionFocus(undefined);
  };

  const handleClose = () => {
    setOpen(false);
    clear();

    // optionally rerender the parent
    if (setIsParentUpdated)
      setIsParentUpdated();
  };

  const clearEditAttraction = () => {
    setOpenEditAttraction(false);
    setDescription("");
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
          <SearchPanel
            result={result}
            setResult={setResult}
            idFocus={idFocus}
            setIdFocus={setIdFocus}
            setOpenHighlight={setOpenHighlight}
            clearEditAttraction={clearEditAttraction}
            handleClose={handleClose}
          />
        </Grid>

        {/* right panel */}
        <Grid size={8}>
          <MapPanel
            result={result}
            attractionResult={attractionResult}
            attractionFocus={attractionFocus}
            setAttractionFocus={setAttractionFocus}
            idFocus={idFocus}
            openHighlight={openHighlight}
            setOpenHighlight={setOpenHighlight}
            openEditAttraction={openEditAttraction}
            setOpenEditAttraction={setOpenEditAttraction}
            description={description}
            setDescription={setDescription}
            setIsParentUpdated={() => setIsUpdated(prev => !prev)}
            clearEditAttraction={clearEditAttraction}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AttractionFinder;
