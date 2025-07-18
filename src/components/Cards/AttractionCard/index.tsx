import Map from "@components/Map";
import { Box, Typography } from "@mui/material";
import type { AttractionV2 } from "@services/attractions";
import MapUtils from "@utils/MapUtils";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./index.scss";

type AttractionCardProps = {
  attraction: AttractionV2;
};

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const navigate = useNavigate();
  // styling
  const attractionCardHoverBoxClassName = `attraction-card-hover-box ${
    isHover && "hover"
  }`;

  const markers = [
    {
      title: attraction.title,
      lat: attraction.lat,
      lng: attraction.lng,
      zoom: MapUtils.resultTypeToZoom(attraction.resultType),
    },
  ];

  return (
    <Box
      key={`my-trip-${attraction.id}`}
      className="attraction-card-box"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/workshop/highlight/${attraction.id}`)}
    >
      {/* attraction location on map (read-only) */}
      <Box className="attraction-card-map-box">
        <Map readonly updateOnMarkerFocus markers={markers} />

        <Box className={attractionCardHoverBoxClassName}>
          <Typography className="attraction-card-hover-number">
            {attraction.numHighlights}
          </Typography>
          <Typography className="attraction-card-hover-text">
            {(attraction.numHighlights ?? 0) > 1 ? "Highlights" : "Highlight"}
          </Typography>
          <Typography>Click to view</Typography>
        </Box>
      </Box>

      {/* attraction info */}
      <Box className="attraction-card-info-box">
        <Typography className="attraction-card-info-title">
          {attraction.title}
        </Typography>

        <Typography className="attraction-card-info-address">
          {attraction.address}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttractionCard;
