import { Box, Chip, Typography } from "@mui/material";
import type { Attraction } from "@services/attractions";
import MapUtils from "@utils/MapUtils";
import { useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import "./index.scss";
import React from "react";

// lazy load
const Map = React.lazy(() => import("@components/Map"));

type AttractionCardProps = {
  attraction: Attraction;
  showHovers?: boolean;
};

const AttractionCard = ({
  attraction,
  showHovers = false,
}: AttractionCardProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const navigate = useNavigate();

  // styling
  const attractionCardHoverBoxClassName = clsx(
    "attraction-card-hover-box",
    (showHovers || isHover) && "hover"
  );

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
      className="attraction-card-box"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/attraction/${attraction.id}`)}
    >
      {/* attraction location on map (read-only) */}
      <Box className="attraction-card-map-box">
        <Map readonly markers={markers} />

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

        {attraction.category && (
          <Chip
            size="small"
            label={attraction.category}
            className="attraction-card-info-chip"
          />
        )}

        <Typography className="attraction-card-info-address">
          {attraction.address}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttractionCard;
