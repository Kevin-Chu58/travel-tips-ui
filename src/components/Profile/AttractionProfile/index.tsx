import TTButton from "@components/TTButton";
import { Alert, Box, CircularProgress } from "@mui/material";
import { attractionsService } from "@services/attractions";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AttractionFragment from "./AttractionFragment";
import HighlightsFragment from "./HighlightsFragment";
import { type HerePlace } from "@services/hereMap/hereMap";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.scss";
import { enqueueSnackbar } from "notistack";

type HighlightPropfileProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  back?: boolean;
};

const AttractionProfile = ({
  containerRef,
  back = false,
}: HighlightPropfileProps) => {
  // herePlace
  const [herePlace, setHerePlace] = useState<HerePlace | undefined>();
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // others
  const { attractionId } = useParams();
  const _attractionId = attractionId ? parseInt(attractionId) : undefined;
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  // render attraction on attractionId
  useEffect(() => {
    const getAttraction = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if (_attractionId && !herePlace) {
        setIsLoading(true);
        try {
          const hereMapPlace =
            await attractionsService.getHerePlaceByAttractionId(_attractionId);
          setHerePlace(hereMapPlace);
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
        setIsLoading(false);
      }
    };
    getAttraction();
  }, [_attractionId]);

  const goBackSafe = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Box className="highlight-profile-box" maxWidth="md">
      <Box className="highlight-profile-content-box">
        {/* nav back button */}
        {back ? (
          <Box>
            <TTButton
              label="back"
              variant="text"
              startIcon={<NavigateBeforeIcon />}
              onClick={goBackSafe}
            />
          </Box>
        ) : undefined}

        {/* attraction */}
        {!isLoading ? (
          herePlace ? (
            <AttractionFragment herePlace={herePlace} />
          ) : (
            <Alert severity="error">
              Place is deprecated in{" "}
              <Link
                to="https://www.here.com/developer"
                target="_blank"
                rel="noopener"
              >
                HERE MAP
              </Link>{" "}
              database.
            </Alert>
          )
        ) : (
          <Box className="column center flex">
            <CircularProgress color="info" aria-label="Loading…" />
          </Box>
        )}

        {/* highlights */}
        <HighlightsFragment
          containerRef={containerRef}
          parentAttractionId={_attractionId}
        />
      </Box>
    </Box>
  );
};

export default AttractionProfile;
