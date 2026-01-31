import TTButton from "@components/TTButton";
import { Box } from "@mui/material";
import { attractionsService } from "@services/attractions";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AttractionFragment from "./AttractionFragment";
import HighlightsFragment from "./HighlightsFragment";
import { type HerePlace } from "@services/hereMap/hereMap";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.scss";

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
        try {
          const hereMapPlace =
            await attractionsService.getHerePlaceByAttractionId(_attractionId);
          setHerePlace(hereMapPlace);
        } catch (_) {
          navigate("/");
        }
      }
    };
    getAttraction();
  }, [_attractionId]);

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
              onClick={() => navigate(-1)}
            />
          </Box>
        ) : undefined}

        {/* attraction */}
        <AttractionFragment herePlace={herePlace} />

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
