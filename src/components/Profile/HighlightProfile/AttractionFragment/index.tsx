import TTChipButton from "@components/TTChipButton";
import { Box, Skeleton, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import React from "react";
import Map from "@components/Map";
import MapUtils from "@utils/MapUtils";
import type { Attraction } from "@services/attractions";
import "./index.scss";

type AttractionFragmentProps = {
  attraction: Attraction | undefined;
  isAttractionLoading: boolean;
  isMobile: boolean;
};

const AttractionFragment = ({
  attraction,
  isAttractionLoading,
  isMobile,
}: AttractionFragmentProps) => {
  // styling
  const attractionFragmentBoxClassName = `highlight-profile-attraction-fragment-box ${
    isMobile && "mobile"
  }`;
  const attractionFragmentMapBoxClassName = `highlight-profile-attraction-fragment-map-box ${
    isMobile && "mobile"
  }`;

  const markers = attraction
    ? [
        {
          id: attraction.hereId,
          label: attraction.title,
          lat: attraction.lat,
          lng: attraction.lng,
          zoom: MapUtils.resultTypeToZoom(attraction.resultType),
        },
      ]
    : [];

  return (
    <React.Fragment>
      {!isAttractionLoading ? (
        attraction && (
          <Box className={attractionFragmentBoxClassName}>
            <Box>
              {/* title */}
              <Typography className="highlight-profile-attraction-fragment-title">
                {attraction.title}
              </Typography>

              {/* address */}
              <Typography className="highlight-profile-attraction-fragment-address">
                {attraction.address}
              </Typography>

              {/* links */}
              <Box>
                <a
                  href={MapUtils.getGoogleMapLink(attraction.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TTChipButton icon={<GoogleIcon />} label="Google Map" />
                </a>
              </Box>
            </Box>

            {/* map */}
            <Box className={attractionFragmentMapBoxClassName}>
              <Map
                readonly
                markers={markers}
                focusId={attraction.hereId}
              />
            </Box>
          </Box>
        )
      ) : (
        <Skeleton
          className="highlight-profile-attraction-fragment-skeleton"
          variant="rectangular"
        />
      )}
    </React.Fragment>
  );
};

export default AttractionFragment;
